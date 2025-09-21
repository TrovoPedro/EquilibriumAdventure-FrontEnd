import React, { useEffect, useRef, useState, useCallback } from 'react';
import './MapaTrilha.css';

const MapaTrilha = ({ gpxFile, altura = '400px' }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Inicializar o mapa
    useEffect(() => {
        let isMounted = true;

        // Carregar as bibliotecas do Leaflet
        const loadLeaflet = () => {
            return new Promise((resolve, reject) => {
                if (window.L) {
                    resolve();
                    return;
                }

                // Carregar CSS do Leaflet
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
                document.head.appendChild(link);

                // Carregar JS do Leaflet
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        // Carregar toGeoJSON
        const loadToGeoJSON = () => {
            return new Promise((resolve, reject) => {
                if (window.toGeoJSON) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/togeojson/0.16.0/togeojson.min.js';
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initializeMap = async () => {
            try {
                await loadLeaflet();
                await loadToGeoJSON();

                if (isMounted && mapRef.current && !map) {
                    const newMap = window.L.map(mapRef.current).setView([-25.4284, -49.2733], 13);
                    
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(newMap);

                    setMap(newMap);
                }
            } catch (error) {
                // Erro silencioso - não afetar interface
                if (isMounted) {
                    console.warn('Leaflet loading failed:', error);
                }
            }
        };

        initializeMap();

        // Cleanup
        return () => {
            isMounted = false;
            if (map) {
                map.remove();
            }
        };
    }, [map]); // Adicionar dependência

    // Carregar arquivo GPX
    const loadGPXFile = useCallback(async (filePath) => {
        if (!map || !window.toGeoJSON) return;

        setIsLoading(true);
        setError(null);

        // Tentar diferentes caminhos para encontrar o arquivo
        const possiblePaths = [
            `/assets/gpx-files/${filePath}`,
            `/assets/${filePath}`,
            `./assets/gpx-files/${filePath}`,
            `./assets/${filePath}`,
            filePath
        ];

        let gpxLoaded = false;

        for (const path of possiblePaths) {
            if (gpxLoaded) break;
            
            try {
                const response = await fetch(path);
                if (response.ok) {
                    const gpxText = await response.text();
                    
                    const parser = new DOMParser();
                    const gpx = parser.parseFromString(gpxText, 'application/xml');
                    
                    // Verificar se é um arquivo GPX válido
                    if (gpx.documentElement.tagName !== 'gpx') {
                        continue;
                    }
                    
                    const geojson = window.toGeoJSON.gpx(gpx);

                    if (!geojson.features || geojson.features.length === 0) {
                        continue;
                    }

                    const coords = geojson.features[0].geometry.coordinates.map(c => [c[1], c[0]]);

                    // Limpar camadas anteriores
                    map.eachLayer(layer => {
                        if (layer instanceof window.L.Polyline || layer instanceof window.L.Marker) {
                            map.removeLayer(layer);
                        }
                    });

                    // Adicionar nova rota
                    const polyline = window.L.polyline(coords, { 
                        color: '#0066cc',
                        weight: 5,
                        opacity: 0.7
                    }).addTo(map);

                    // Adicionar marcadores
                    window.L.marker(coords[coords.length - 1], {
                        icon: window.L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41]
                        })
                    }).bindPopup('Ponto Final').addTo(map);

                    window.L.marker(coords[0], {
                        icon: window.L.icon({
                            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                        }),
                        zIndexOffset: 1000
                    }).bindPopup('Ponto de Partida').addTo(map);

                    // Ajustar visualização do mapa
                    map.fitBounds(polyline.getBounds(), {
                        padding: [30, 30],
                        maxZoom: 16
                    });
                    
                    gpxLoaded = true;
                }
            } catch (error) {
                // Falha silenciosa para tentativas de caminhos inválidos
                continue;
            }
        }

        if (!gpxLoaded) {
            console.warn(`Arquivo GPX não encontrado: ${filePath}`);
        }

        setIsLoading(false);
    }, [map]);

    // Carregar arquivo GPX quando a prop mudar
    useEffect(() => {
        if (gpxFile && map && window.L) {
            loadGPXFile(gpxFile);
        }
    }, [gpxFile, map, loadGPXFile]);

    return (
        <div className="mapa-trilha-container">
            {isLoading && (
                <div className="mapa-trilha-loading">
                    Carregando mapa da trilha...
                </div>
            )}
            <div 
                ref={mapRef} 
                className="mapa-trilha"
                style={{ 
                    height: altura,
                    width: '100%',
                    borderRadius: '8px',
                    border: '1px solid #bdbdbd'
                }}
            />
        </div>
    );
};

export default MapaTrilha;