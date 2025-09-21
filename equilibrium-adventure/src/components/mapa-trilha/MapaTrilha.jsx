import React, { useEffect, useRef, useState } from 'react';
import './MapaTrilha.css';

const MapaTrilha = ({ gpxFile, altura = '400px' }) => {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Inicializar o mapa
    useEffect(() => {
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

                if (mapRef.current && !map) {
                    const newMap = window.L.map(mapRef.current).setView([-25.4284, -49.2733], 13);
                    
                    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors'
                    }).addTo(newMap);

                    setMap(newMap);
                }
            } catch (error) {
                console.error('Erro ao carregar as bibliotecas do mapa:', error);
                // Não mostrar erro na interface, apenas no console
            }
        };

        initializeMap();

        // Cleanup
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, []);

    // Carregar arquivo GPX
    const loadGPXFile = async (filePath) => {
        if (!map || !window.toGeoJSON) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(filePath);
            const gpxText = await response.text();
            
            const parser = new DOMParser();
            const gpx = parser.parseFromString(gpxText, 'application/xml');
            const geojson = window.toGeoJSON.gpx(gpx);

            if (!geojson.features || geojson.features.length === 0) {
                throw new Error('Nenhum dado encontrado no arquivo GPX.');
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
        } catch (error) {
            console.error('Erro ao carregar o arquivo GPX:', error);
            // Não mostrar erro na interface se o mapa já está funcionando
        } finally {
            setIsLoading(false);
        }
    };

    // Carregar arquivo GPX quando a prop mudar
    useEffect(() => {
        if (gpxFile && map) {
            loadGPXFile(gpxFile);
        }
    }, [gpxFile, map]);

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