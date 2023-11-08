import React from 'react';
import { MapComponentTemplateProps } from 'lib/component-props/EspireTemplateProps/PageContent/MapComponentTemplateProps';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

import { withDatasourceCheck } from '@sitecore-jss/sitecore-jss-nextjs';

export const MapComponent = (props: MapComponentTemplateProps): JSX.Element => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyD_0f6HchBUrvF0JEFRkttlVPPLQTfEdOw',
  });

  console.log(props);
  const markers = [
    { address: 'Address1', lat: 18.5204, lng: 73.8567 },
    { address: 'Address2', lat: 18.5314, lng: 73.8446 },
    { address: 'Address3', lat: 18.5642, lng: 73.7769 },
  ];

  const onLoad = (map: { fitBounds: (arg0: google.maps.LatLngBounds) => void }) => {
    const bounds = new google.maps.LatLngBounds();
    markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const customMarker = {
    path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
    fillColor: 'red',
    fillOpacity: 2,
    strokeWeight: 1,
    rotation: 0,
    scale: 1,
  };

  return (
    <>
      <div style={{ height: '100dvh', width: '100%' }}>
        {!isLoaded ? (
          <h1>Loading...</h1>
        ) : (
          <GoogleMap mapContainerClassName="map-container" onLoad={onLoad}>
            {markers.map(({ lat, lng }) => (
              <Marker position={{ lat, lng }} icon={customMarker} key="lat" />
            ))}
          </GoogleMap>
        )}
      </div>
    </>
  );
};

export default withDatasourceCheck()<MapComponentTemplateProps>(MapComponent);
