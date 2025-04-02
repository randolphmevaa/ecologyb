// First, let's update the CadastreMap component (components/CadastreMap.tsx)
import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import type { Map as LeafletMap, Marker,   LeafletMouseEvent, Control } from 'leaflet';

// Define interface for parcel information
interface ParcelInfo {
  parcelle: string;
  numero: string;
  section: string;
  insee: string;
  surface: string;
  adresse: string;
}

// Define props interface
interface CadastreMapProps {
  onParcelSelect?: (parcel: ParcelInfo) => void;
  initialAddress?: string;
}

// Define the methods we expose via ref
interface CadastreMapHandle {
  searchAddress: (address: string) => Promise<void>;
}

const CadastreMap = forwardRef<CadastreMapHandle, CadastreMapProps>(({ onParcelSelect, initialAddress }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ , setLayersControl] = useState<Control.Layers | null>(null);

  // Search address function that can be called externally
  const searchAddress = async (address: string): Promise<void> => {
    if (!mapInstanceRef.current) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, France&limit=1`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        // Center map on result
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latNum, lonNum], 17);
          
          // Clear existing markers
          if (selectedMarker) {
            mapInstanceRef.current.removeLayer(selectedMarker);
            setSelectedMarker(null);
          }
          
          // Dynamically import Leaflet
          const L = await import('leaflet');
          
          // Add pulsing marker at the address
          const addressMarker = L.marker([latNum, lonNum], {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: `<div class="marker-pin pulsing-marker"></div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            })
          }).addTo(mapInstanceRef.current);
          
          addressMarker.bindPopup(`<strong>Adresse recherchée</strong><br>${data[0].display_name}`).openPopup();
          
          // Trigger a simulated click nearby to suggest a parcel
          setTimeout(() => {
            // Simulate finding a parcel near the searched location
            const sectionCode = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                               String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const parcelNumber = Math.floor(Math.random() * 9000) + 1000;
            const formattedParcel = `${Math.floor(Math.random() * 999).toString().padStart(3, '0')} / ${sectionCode} / ${parcelNumber.toString().padStart(4, '0')}`;
            const surfaceArea = Math.floor(Math.random() * 5000) + 500;
            
            // Add parcel marker with a slight offset from the address
            // const parcelMarker = L.marker([latNum + 0.0003, lonNum + 0.0003], {
            //   icon: L.divIcon({
            //     className: 'custom-div-icon',
            //     html: `<div class="marker-pin parcel-marker"></div>`,
            //     iconSize: [30, 30],
            //     iconAnchor: [15, 15]
            //   })
            // }).addTo(mapInstanceRef.current!);
            
            // Create parcel info
            const parcelInfo: ParcelInfo = {
              parcelle: formattedParcel,
              numero: parcelNumber.toString().padStart(4, '0'),
              section: sectionCode,
              insee: (Math.floor(Math.random() * 90000) + 10000).toString(),
              surface: `${surfaceArea} m²`,
              adresse: data[0].display_name
            };
            
            // Draw a rectangle to represent the parcel
            const parcelRect = L.rectangle([[latNum + 0.0002, lonNum], [latNum + 0.0005, lonNum + 0.0005]], {
              color: '#3B82F6',
              weight: 2,
              fillColor: '#3B82F6',
              fillOpacity: 0.2
            }).addTo(mapInstanceRef.current!);
            
            // Make the rectangle clickable
            parcelRect.on('click', function() {
              if (selectedMarker) {
                mapInstanceRef.current!.removeLayer(selectedMarker);
              }
              
              // Create a highlighted marker for the selected parcel
              const highlight = L.marker([latNum + 0.00035, lonNum + 0.00025], {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="marker-pin selected-parcel"></div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })
              }).addTo(mapInstanceRef.current!);
              
              // Show popup with parcel information
              highlight.bindPopup(`
                <strong>Parcelle: ${parcelInfo.parcelle}</strong><br>
                Section: ${parcelInfo.section}<br>
                N° Parcelle: ${parcelInfo.numero}<br>
                Surface: ${parcelInfo.surface}
              `).openPopup();
              
              setSelectedMarker(highlight);
              
              // Pass parcel data to parent
              if (onParcelSelect) {
                onParcelSelect(parcelInfo);
              }
            });
            
            // Simulate a click on the parcel to select it automatically
            parcelRect.fire('click');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error searching address:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Expose searchAddress method via ref
  useImperativeHandle(ref, () => ({
    searchAddress
  }), [searchAddress]);

  useEffect(() => {
    // This code only runs on the client side
    if (typeof window !== 'undefined' && mapContainerRef.current && !mapInstanceRef.current) {
      setIsLoading(true);
      
      const initializeMap = async () => {
        try {
          // Add CSS for Leaflet and custom markers
          const leafletCss = document.createElement("link");
          leafletCss.rel = "stylesheet";
          leafletCss.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
          document.head.appendChild(leafletCss);
          
          // Add custom CSS for markers
          const customCss = document.createElement("style");
          customCss.textContent = `
            .custom-div-icon {
              background: transparent;
              border: none;
            }
            .marker-pin {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: #3B82F6;
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            }
            .pulsing-marker {
              animation: pulse 1.5s infinite;
              background: #EF4444;
            }
            .parcel-marker {
              background: #10B981;
            }
            .selected-parcel {
              width: 32px;
              height: 32px;
              background: #F59E0B;
              border: 3px solid white;
              box-shadow: 0 0 6px rgba(0,0,0,0.5);
            }
            @keyframes pulse {
              0% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.2); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
            .leaflet-container {
              width: 100%; 
              height: 100%; 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .parcel-highlight {
              background-color: rgba(59, 130, 246, 0.2);
              border: 2px solid #3B82F6;
              border-radius: 4px;
              cursor: pointer;
              transition: background-color 0.3s ease;
            }
            .parcel-highlight:hover {
              background-color: rgba(59, 130, 246, 0.4);
            }
            .selection-instructions {
              position: absolute;
              top: 10px;
              left: 10px;
              right: 10px;
              background: rgba(255,255,255,0.9);
              padding: 8px 12px;
              border-radius: 4px;
              box-shadow: 0 1px 4px rgba(0,0,0,0.2);
              z-index: 1000;
              pointer-events: none;
              font-size: 14px;
              text-align: center;
            }
            .selection-instructions > div {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 4px;
            }
            .selection-dot {
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              margin-right: 6px;
            }
            .selection-dot.address { background: #EF4444; }
            .selection-dot.parcel { background: #10B981; }
            .selection-dot.selected { background: #F59E0B; }
          `;
          document.head.appendChild(customCss);

          // Dynamically import Leaflet
          const L = await import('leaflet');
          
          // Create map
          const map = L.map(mapContainerRef.current!, {
            center: [46.603354, 1.888334], // Center on France
            zoom: 6,
            attributionControl: true,
            zoomControl: false // We'll add custom zoom control
          });
          
          // Add attribution
          map.attributionControl.setPrefix("Cadastre data: IGN France");
          
          // Add custom zoom control in the top right
          L.control.zoom({
            position: 'topright'
          }).addTo(map);
          
          // Base layers
          const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
          });
          
          const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: '© Esri'
          });
          
          // Add the default layer
          osmLayer.addTo(map);
          
          // Create the layer control with base layers and overlays
          const baseLayers = {
            "Plan": osmLayer,
            "Satellite": satelliteLayer
          };
          
          // Overlay layers
          const cadastreLayer = L.tileLayer.wms('https://wxs.ign.fr/parcellaire/geoportail/r/wms', {
            layers: 'CADASTRALPARCELS.PARCELS',
            format: 'image/png',
            transparent: true,
            attribution: '© IGN - Cadastre',
            opacity: 0.7
          });
          
          const overlays = {
            "Parcelles cadastrales": cadastreLayer
          };
          
          // Add layers control to the map
          const layersCtrl = L.control.layers(baseLayers, overlays, {
            position: 'topright',
            collapsed: false
          }).addTo(map);
          
          setLayersControl(layersCtrl);
          
          // Add cadastre layer by default
          cadastreLayer.addTo(map);
          
          // Add a scale control
          L.control.scale({
            imperial: false,
            position: 'bottomleft'
          }).addTo(map);
          
          // Add a fullscreen button
          const fullscreenButton = new L.Control({ position: 'topright' });
          fullscreenButton.onAdd = function() {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            div.innerHTML = `<a href="#" title="Plein écran" style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;background:white;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
            </a>`;
            div.style.cursor = 'pointer';
            div.onclick = function() {
              const mapContainer = mapContainerRef.current!.parentElement;
              if (mapContainer) {
                if (!document.fullscreenElement) {
                  mapContainer.requestFullscreen().catch(err => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                  });
                } else {
                  document.exitFullscreen();
                }
              }
              return false;
            };
            return div;
          };
          fullscreenButton.addTo(map);
          
          // Add click handler for map
          map.on('click', async function(e: LeafletMouseEvent) {
            // Clear previous selected marker
            if (selectedMarker) {
              map.removeLayer(selectedMarker);
              setSelectedMarker(null);
            }
            
            // Get clicked coordinates
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;
            
            // Generate parcel data (in a real app this would be an API call)
            const sectionCode = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                               String.fromCharCode(65 + Math.floor(Math.random() * 26));
            const parcelNumber = Math.floor(Math.random() * 9000) + 1000;
            const formattedParcel = `${Math.floor(Math.random() * 999).toString().padStart(3, '0')} / ${sectionCode} / ${parcelNumber.toString().padStart(4, '0')}`;
            const surfaceArea = Math.floor(Math.random() * 5000) + 500;
            
            // Create parcel rectangle
            const parcelRect = L.rectangle([[lat - 0.0002, lng - 0.0002], [lat + 0.0002, lng + 0.0002]], {
              color: '#3B82F6',
              weight: 2,
              fillColor: '#3B82F6', 
              fillOpacity: 0.2,
              className: 'parcel-highlight'
            }).addTo(map);
            
            // Make it clickable
            parcelRect.on('click', function() {
              if (selectedMarker) {
                map.removeLayer(selectedMarker);
              }
              
              // Create a highlighted marker for the selected parcel
              const highlight = L.marker([lat, lng], {
                icon: L.divIcon({
                  className: 'custom-div-icon',
                  html: `<div class="marker-pin selected-parcel"></div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })
              }).addTo(map);
              
              setSelectedMarker(highlight);
              
              // Create parcel info
              const parcelInfo: ParcelInfo = {
                parcelle: formattedParcel,
                numero: parcelNumber.toString().padStart(4, '0'),
                section: sectionCode,
                insee: (Math.floor(Math.random() * 90000) + 10000).toString(),
                surface: `${surfaceArea} m²`,
                adresse: `${Math.floor(Math.random() * 1500) + 1} Rue de ${['Paris', 'Lyon', 'Marseille', 'Nantes', 'Bordeaux'][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 90000) + 10000}`
              };
              
              // Show popup with parcel information
              highlight.bindPopup(`
                <strong>Parcelle: ${parcelInfo.parcelle}</strong><br>
                Section: ${parcelInfo.section}<br>
                N° Parcelle: ${parcelInfo.numero}<br>
                Surface: ${parcelInfo.surface}
              `).openPopup();
              
              // Pass parcel data to parent
              if (onParcelSelect) {
                onParcelSelect(parcelInfo);
              }
            });
            
            // Simulate clicking on the parcel
            parcelRect.fire('click');
          });
          
          // Store the map reference
          mapInstanceRef.current = map;
          
          // Add the selection instructions element
          const instructionsDiv = L.DomUtil.create('div', 'selection-instructions');
          instructionsDiv.innerHTML = `
            <strong>Instructions pour sélectionner une parcelle cadastrale:</strong>
            <div>
              <span class="selection-dot address"></span> Point rouge : Adresse recherchée
              <span style="margin-left: 12px;"></span>
              <span class="selection-dot parcel"></span> Point vert : Parcelle disponible
              <span style="margin-left: 12px;"></span>
              <span class="selection-dot selected"></span> Point orange : Parcelle sélectionnée
            </div>
          `;
          mapContainerRef.current!.appendChild(instructionsDiv);
          
          // If initialAddress is provided, search for it
          if (initialAddress) {
            setTimeout(() => {
              searchAddress(initialAddress);
            }, 500);
          }
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error initializing map:', error);
          setIsLoading(false);
        }
      };
      
      initializeMap();
    }
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initialAddress]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-indigo-600 font-medium">Chargement de la carte...</p>
          </div>
        </div>
      )}
    </div>
  );
});

CadastreMap.displayName = 'CadastreMap';

export default CadastreMap;