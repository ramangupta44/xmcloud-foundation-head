import React, { useRef, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapComponentProps } from 'lib/component-props/EspireTemplateProps/Maps/MapsProps';
import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

export const Maps = (props: MapComponentProps): JSX.Element => {
  const mapRef = useRef<HTMLDivElement>(null);
  const MapId = process?.env?.NEXT_PUBLIC_GOOGLE_MAP_ID as string;

  useEffect(() => {
    const loader = new Loader({
      apiKey: process?.env?.NEXT_PUBLIC_GOOGLE_MAP_API as string,
      version: 'weekly',
      libraries: ['places', 'geometry'],
      mapIds: [MapId],
    });

    loader
      .importLibrary('maps')
      .then(async () => {
        const { AdvancedMarkerElement } = await loader.importLibrary('marker');

        if (mapRef?.current) {
          const map = new google.maps.Map(mapRef?.current, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 1,
            mapId: MapId,
          });

          const geocoder = new google.maps.Geocoder();
          props?.fields?.AddressCollection?.forEach((addressItem) => {
            const address = addressItem?.fields?.Address?.value;
            geocoder.geocode({ address: address }, (results, status) => {
              if (status === 'OK' && results && results[0]) {
                map.setCenter(results[0]?.geometry?.location);

                new AdvancedMarkerElement({
                  position: results[0]?.geometry?.location,
                  map,
                  title: address,
                });
              } else {
                console.error('Geocode was not successful for the following reason: ' + status);
              }
            });
          });
        }
      })
      .catch((e) => console.error('Failed to load Google Maps script:', e));
  }, [MapId, props?.fields?.AddressCollection]);

  return (
    <div
      className={`map-container ${props?.params?.styles} ${props?.className}`}
      style={{ width: '100%', height: '400px' }}
    >
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default withDatasourceCheck()(Maps);
