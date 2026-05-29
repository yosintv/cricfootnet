from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional
import uuid
from datetime import datetime, timezone, timedelta
import requests
from collections import defaultdict


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Data cache to avoid repeated fetches
data_cache = {}
CACHE_DURATION = 3600  # 1 hour in seconds

# External data source
DATA_BASE_URL = "https://livesoccertv.pages.dev/date"


# Helper Functions
def get_date_string(days_offset=0):
    """Generate date string in YYYYMMDD format"""
    target_date = datetime.now() + timedelta(days=days_offset)
    return target_date.strftime("%Y%m%d")

def fetch_schedule_data(date_str: str) -> List[Dict]:
    """Fetch schedule data from external URL with caching. Returns empty list if not available."""
    cache_key = f"schedule_{date_str}"
    
    # Check cache
    if cache_key in data_cache:
        cached_data, timestamp = data_cache[cache_key]
        if datetime.now().timestamp() - timestamp < CACHE_DURATION:
            return cached_data
    
    # Fetch from external URL
    url = f"{DATA_BASE_URL}/{date_str}.json"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 404:
            # Future date data not available yet - cache empty list
            logging.info(f"Data not available for {date_str} (404)")
            data_cache[cache_key] = ([], datetime.now().timestamp())
            return []
        response.raise_for_status()
        data = response.json()
        
        # Cache the data
        data_cache[cache_key] = (data, datetime.now().timestamp())
        return data
    except requests.RequestException as e:
        logging.error(f"Error fetching data for {date_str}: {e}")
        # Cache empty list briefly to avoid repeated failed requests
        data_cache[cache_key] = ([], datetime.now().timestamp())
        return []

def extract_all_channels(matches: List[Dict]) -> List[str]:
    """Extract unique channel names from matches"""
    channels = set()
    for match in matches:
        for tv_channel in match.get('tv_channels', []):
            for channel in tv_channel.get('channels', []):
                channels.add(channel)
    return sorted(list(channels))

def extract_all_leagues(matches: List[Dict]) -> List[Dict]:
    """Extract unique leagues from matches with match count"""
    leagues_map = {}
    for match in matches:
        league_name = match.get('league')
        league_id = match.get('league_id')
        if league_name:
            if league_name not in leagues_map:
                leagues_map[league_name] = {
                    'name': league_name,
                    'league_id': league_id,
                    'slug': slugify(league_name),
                    'match_count': 0
                }
            leagues_map[league_name]['match_count'] += 1
    return sorted(leagues_map.values(), key=lambda x: x['name'])

def extract_all_countries(matches: List[Dict]) -> List[str]:
    """Extract unique country names from matches"""
    countries = set()
    for match in matches:
        for tv_channel in match.get('tv_channels', []):
            country = tv_channel.get('country')
            if country:
                countries.add(country)
    return sorted(list(countries))

def get_7day_schedule() -> Dict[str, List[Dict]]:
    """Get schedule for 7 days (today + next 6 days). 
    If a future date's data is not available, that day will have empty matches.
    """
    schedule = {}
    for i in range(7):
        date_str = get_date_string(i)
        matches = fetch_schedule_data(date_str)
        schedule[date_str] = matches
    return schedule

def get_available_schedule(max_days: int = 7) -> Dict[str, List[Dict]]:
    """Get schedule with graceful fallback. 
    If today/future data is not available, look back to find available data.
    Returns up to max_days of available schedule data.
    """
    schedule = {}
    
    # First, try today + future days
    for i in range(max_days):
        date_str = get_date_string(i)
        matches = fetch_schedule_data(date_str)
        if matches:
            schedule[date_str] = matches
    
    # If we don't have enough days, look backward (past data)
    if len(schedule) < max_days:
        days_needed = max_days - len(schedule)
        for i in range(1, 30):  # Look up to 30 days back
            date_str = get_date_string(-i)
            if date_str not in schedule:
                matches = fetch_schedule_data(date_str)
                if matches:
                    schedule[date_str] = matches
                    days_needed -= 1
                    if days_needed <= 0:
                        break
    
    # Sort by date
    return dict(sorted(schedule.items()))

def slugify(text: str) -> str:
    """Convert channel name to URL-friendly slug"""
    import re
    # Convert to lowercase, replace spaces and special chars with hyphens
    slug = text.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)  # Remove special chars except spaces and hyphens
    slug = re.sub(r'[\s_]+', '-', slug)   # Replace spaces/underscores with hyphens
    slug = re.sub(r'-+', '-', slug)       # Collapse multiple hyphens
    slug = slug.strip('-')                # Trim leading/trailing hyphens
    return slug

def find_channel_by_slug(slug: str) -> Optional[str]:
    """Find the original channel name from a slug"""
    schedule = get_available_schedule()
    all_matches = []
    for matches in schedule.values():
        all_matches.extend(matches)
    
    channels = extract_all_channels(all_matches)
    
    # First try exact slug match
    for channel in channels:
        if slugify(channel) == slug:
            return channel
    
    # Fallback: try URL-decoded match (for backward compatibility)
    from urllib.parse import unquote
    decoded = unquote(slug)
    for channel in channels:
        if channel == decoded:
            return channel
    
    return None

def filter_matches_by_channel(matches: List[Dict], channel_name: str) -> List[Dict]:
    """Filter matches that broadcast on specific channel"""
    filtered = []
    for match in matches:
        for tv_channel in match.get('tv_channels', []):
            if channel_name in tv_channel.get('channels', []):
                filtered.append(match)
                break
    return filtered


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str


# API Routes
@api_router.get("/")
async def root():
    return {"message": "TV Guide Live Streams API"}

@api_router.get("/channels")
async def get_all_channels():
    """Get all unique channel names from available 7-day schedule with slugs"""
    try:
        schedule = get_available_schedule()
        all_matches = []
        for matches in schedule.values():
            all_matches.extend(matches)
        
        channels = extract_all_channels(all_matches)
        channels_with_slugs = [{"name": ch, "slug": slugify(ch)} for ch in channels]
        
        return {
            "total": len(channels),
            "channels": channels,
            "channels_with_slugs": channels_with_slugs
        }
    except Exception as e:
        logging.error(f"Error getting channels: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/countries")
async def get_all_countries():
    """Get all unique country names from 7-day schedule"""
    try:
        schedule = get_7day_schedule()
        all_matches = []
        for matches in schedule.values():
            all_matches.extend(matches)
        
        countries = extract_all_countries(all_matches)
        return {
            "total": len(countries),
            "countries": countries
        }
    except Exception as e:
        logging.error(f"Error getting countries: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/leagues")
async def get_all_leagues():
    """Get all unique leagues from 7-day schedule (with fallback to available data)"""
    try:
        schedule = get_available_schedule()
        all_matches = []
        for matches in schedule.values():
            all_matches.extend(matches)
        
        leagues = extract_all_leagues(all_matches)
        return {
            "total": len(leagues),
            "leagues": leagues
        }
    except Exception as e:
        logging.error(f"Error getting leagues: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/league/{league_slug}")
async def get_league_matches(league_slug: str):
    """Get all matches for a specific league (uses available 7-day data)"""
    try:
        schedule = get_available_schedule()
        
        # Find matches for this league across all dates
        league_schedule = []
        league_name = None
        
        for date_str, matches in schedule.items():
            day_matches = []
            for match in matches:
                if slugify(match.get('league', '')) == league_slug:
                    day_matches.append(match)
                    if not league_name:
                        league_name = match.get('league')
            
            if day_matches:
                date_obj = datetime.strptime(date_str, "%Y%m%d")
                league_schedule.append({
                    "date": date_str,
                    "formatted_date": date_obj.strftime("%B %d, %Y"),
                    "day_name": date_obj.strftime("%A"),
                    "matches": day_matches
                })
        
        if not league_name:
            raise HTTPException(status_code=404, detail="League not found")
        
        total_matches = sum(len(day['matches']) for day in league_schedule)
        
        return {
            "league_name": league_name,
            "slug": league_slug,
            "total_days": len(league_schedule),
            "total_matches": total_matches,
            "schedule": league_schedule
        }
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting league matches for {league_slug}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/schedule/7days")
async def get_schedule_7days():
    """Get 7-day schedule (today + next 6 days, with fallback to available data)"""
    try:
        schedule = get_available_schedule()
        
        # Format response with readable dates
        formatted_schedule = {}
        for date_str, matches in schedule.items():
            date_obj = datetime.strptime(date_str, "%Y%m%d")
            formatted_date = date_obj.strftime("%B %d, %Y")
            formatted_schedule[date_str] = {
                "date": formatted_date,
                "day_name": date_obj.strftime("%A"),
                "total_matches": len(matches),
                "matches": matches
            }
        
        return formatted_schedule
    except Exception as e:
        logging.error(f"Error getting 7-day schedule: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/schedule/{date}")
async def get_schedule_by_date(date: str):
    """Get schedule for specific date (format: YYYYMMDD)"""
    try:
        matches = fetch_schedule_data(date)
        date_obj = datetime.strptime(date, "%Y%m%d")
        
        return {
            "date": date,
            "formatted_date": date_obj.strftime("%B %d, %Y"),
            "day_name": date_obj.strftime("%A"),
            "total_matches": len(matches),
            "matches": matches
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYYMMDD")
    except Exception as e:
        logging.error(f"Error getting schedule for {date}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/channel/{channel_name}")
async def get_channel_schedule(channel_name: str):
    """Get all upcoming matches for specific channel (7 days). Supports slug or name."""
    try:
        # Try to resolve slug to actual channel name
        resolved_name = find_channel_by_slug(channel_name) or channel_name
        
        schedule = get_available_schedule()
        channel_matches = []
        
        for date_str, matches in schedule.items():
            filtered = filter_matches_by_channel(matches, resolved_name)
            if filtered:
                date_obj = datetime.strptime(date_str, "%Y%m%d")
                channel_matches.append({
                    "date": date_str,
                    "formatted_date": date_obj.strftime("%B %d, %Y"),
                    "day_name": date_obj.strftime("%A"),
                    "matches": filtered
                })
        
        return {
            "channel_name": resolved_name,
            "slug": slugify(resolved_name),
            "total_days": len(channel_matches),
            "schedule": channel_matches
        }
    except Exception as e:
        logging.error(f"Error getting channel schedule for {channel_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/channel/{channel_name}/today")
async def get_channel_today(channel_name: str):
    """Get today's matches for specific channel. Supports slug or name."""
    try:
        # Try to resolve slug to actual channel name
        resolved_name = find_channel_by_slug(channel_name) or channel_name
        
        today = get_date_string(0)
        matches = fetch_schedule_data(today)
        filtered = filter_matches_by_channel(matches, resolved_name)
        
        date_obj = datetime.now()
        return {
            "channel_name": resolved_name,
            "slug": slugify(resolved_name),
            "date": today,
            "formatted_date": date_obj.strftime("%B %d, %Y"),
            "day_name": date_obj.strftime("%A"),
            "total_matches": len(filtered),
            "matches": filtered
        }
    except Exception as e:
        logging.error(f"Error getting today's schedule for {channel_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/match/{match_id}")
async def get_match_detail(match_id: int):
    """Get detailed information for a specific match"""
    try:
        schedule = get_available_schedule()
        
        # Search for the match in all days
        for date_str, matches in schedule.items():
            for match in matches:
                if match.get('match_id') == match_id:
                    # Sort countries alphabetically
                    if match.get('tv_channels'):
                        sorted_channels = sorted(
                            match['tv_channels'], 
                            key=lambda x: x.get('country', '')
                        )
                        match['tv_channels'] = sorted_channels
                    
                    date_obj = datetime.strptime(date_str, "%Y%m%d")
                    return {
                        "match": match,
                        "date": date_str,
                        "formatted_date": date_obj.strftime("%B %d, %Y"),
                        "day_name": date_obj.strftime("%A")
                    }
        
        raise HTTPException(status_code=404, detail="Match not found")
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error getting match detail for {match_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/sitemap")
async def generate_sitemap():
    """Generate sitemap data for all pages"""
    try:
        base_url = "https://tvguide-live-streams.preview.emergentagent.com"
        
        # Get all channels
        schedule = get_7day_schedule()
        all_matches = []
        for matches in schedule.values():
            all_matches.extend(matches)
        
        channels = extract_all_channels(all_matches)
        
        # Create sitemap URLs
        urls = [
            {"loc": base_url, "priority": "1.0", "changefreq": "daily"},
        ]
        
        # Add channel pages
        for channel in channels:
            urls.append({
                "loc": f"{base_url}/channel/{channel}",
                "priority": "0.8",
                "changefreq": "daily"
            })
        
        # Add match pages
        match_ids = set()
        for match in all_matches:
            match_id = match.get('match_id')
            if match_id and match_id not in match_ids:
                match_ids.add(match_id)
                urls.append({
                    "loc": f"{base_url}/match/{match_id}",
                    "priority": "0.6",
                    "changefreq": "daily"
                })
        
        return {
            "total_urls": len(urls),
            "urls": urls
        }
    except Exception as e:
        logging.error(f"Error generating sitemap: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Include the router in the main app
app.include_router(api_router)

# Sitemap XML endpoint (must be under /api prefix for routing)
@app.get("/api/sitemap.xml")
async def sitemap_xml():
    """Generate sitemap.xml"""
    from fastapi.responses import Response
    from urllib.parse import quote
    
    try:
        base_url = "https://tvguide-live-streams.preview.emergentagent.com"
        
        # Get all channels and matches
        schedule = get_available_schedule()
        all_matches = []
        for matches in schedule.values():
            all_matches.extend(matches)
        
        channels = extract_all_channels(all_matches)
        leagues = extract_all_leagues(all_matches)
        
        # Build XML
        xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        # Static pages
        static_pages = [
            ("", "1.0", "daily"),
            ("/about", "0.7", "monthly"),
            ("/contact", "0.7", "monthly"),
            ("/privacy", "0.5", "yearly"),
            ("/terms", "0.5", "yearly"),
        ]
        
        for path, priority, changefreq in static_pages:
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{base_url}{path}</loc>\n'
            xml_content += f'    <priority>{priority}</priority>\n'
            xml_content += f'    <changefreq>{changefreq}</changefreq>\n'
            xml_content += '  </url>\n'
        
        # Channel pages (using slugs)
        for channel in channels:
            slug = slugify(channel)
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{base_url}/channel/{slug}</loc>\n'
            xml_content += '    <priority>0.8</priority>\n'
            xml_content += '    <changefreq>daily</changefreq>\n'
            xml_content += '  </url>\n'
        
        # League pages (using slugs)
        for league in leagues:
            xml_content += '  <url>\n'
            xml_content += f'    <loc>{base_url}/league/{league["slug"]}</loc>\n'
            xml_content += '    <priority>0.7</priority>\n'
            xml_content += '    <changefreq>daily</changefreq>\n'
            xml_content += '  </url>\n'
        
        # Match pages
        match_ids = set()
        for match in all_matches:
            match_id = match.get('match_id')
            if match_id and match_id not in match_ids:
                match_ids.add(match_id)
                xml_content += '  <url>\n'
                xml_content += f'    <loc>{base_url}/match/{match_id}</loc>\n'
                xml_content += '    <priority>0.6</priority>\n'
                xml_content += '    <changefreq>daily</changefreq>\n'
                xml_content += '  </url>\n'
        
        xml_content += '</urlset>'
        
        return Response(content=xml_content, media_type="application/xml")
    except Exception as e:
        logging.error(f"Error generating sitemap.xml: {e}")
        raise HTTPException(status_code=500, detail=str(e))

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()