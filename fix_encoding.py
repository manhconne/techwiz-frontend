import os

# Fix LocationAwareEventExplorer.tsx
filepath = 'components/LocationAwareEventExplorer.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "{/* Interactive Vector Radar Grid (Simulated Topographic GPS Map with Pins) */}"
end_marker = "{/* Map Bottom Legend / Compass Bar */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_map = """{/* REAL LEAFLET GPS MAP OVERLAY */}
              <div className="relative w-full h-[460px] sm:h-[540px] z-10 rounded-xl overflow-hidden shadow-inner border border-slate-200">
                <RealGpsMap 
                  events={filteredEvents}
                  activeEvent={activeEvent}
                  onEventClick={(ev) => setSelectedEventId(ev.id)}
                />
              </div>

              """
    content = content[:start_idx] + new_map + content[end_idx:]

import_str = "import dynamic from 'next/dynamic';\nconst RealGpsMap = dynamic(() => import('./RealGpsMap'), { ssr: false, loading: () => <div className=\"w-full h-[460px] flex items-center justify-center bg-slate-100 text-slate-400 rounded-xl\">Loading Map...</div> });"
if "const RealGpsMap" not in content:
    content = content.replace("import dynamic from 'next/dynamic';", import_str)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

# Fix RealGpsMap.tsx tile layer
map_file = 'components/RealGpsMap.tsx'
with open(map_file, 'r', encoding='utf-8') as f:
    map_content = f.read()

map_content = map_content.replace('url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"', 'url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"')

with open(map_file, 'w', encoding='utf-8') as f:
    f.write(map_content)

print("Fixed encoding and map tiles!")