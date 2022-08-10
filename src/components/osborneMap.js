import React, { useState, setState, useEffect } from 'react';
//import './App.css';

import './linkFunctions.js'

//import { Amplify, Storage } from 'aws-amplify';
//import awsconfig from './aws-exports';


import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import {LayersControl} from 'react-leaflet/LayersControl';
import { LayerGroup } from 'react-leaflet/LayerGroup';
import { FeatureGroup } from 'react-leaflet/FeatureGroup';
import L from 'leaflet';

import siteList from './resources/Panorama-sites-list-updated.json';


//import { Amplify, Storage } from 'aws-amplify';
//import awsconfig from './aws-exports';

//const [originalImageLinks, setOrLinks] = useState(["","","",""])
//const [replicationImageLinks, setRepLinks] = useState(["","","",""]) //array length may need to change if some sites have more than 4 directions.




class osborneMap extends React.component {

  




  render () {

    

    const recreatedSites = siteList.filter(siteList => siteList.imgRecreated !== "");
    //const originalSites = siteList.filter(siteList => siteList.imgOriginal !== "");  These filtered JSON lists will need to be added at a later date once all scanned original sites have been included.
    //const unscannedSites = siteList.filter(siteList => siteList.imgOriginal === "");
    const imgSource = "https://panoramas-website-storage-f38d7055203555-staging.s3.us-west-1.amazonaws.com/panoramaimages";
    //console.log(recreatedSites);
    //console.log(originalSites);

  return(
    
  <MapContainer center={[45.60, -125.38]} zoom={6} scrollWheelZoom={true} doubleClickZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

       <LayersControl position="topright">
          <LayersControl.Overlay checked name="All Sites">
          <LayerGroup>
                    {siteList.map(site => (
              <Marker
              key = {site.id}
              position = {[site.Latitude, site.Longitude]}
              eventHandlers={{
                click: (e) => {
                  console.log('marker clicked', site)
                },
              }}>
                <Popup>
                <div className="sidebar">
                  <b>Site Name: </b> {site.SiteName}<br />
                  <b>Forest:  </b> {site.Forest}<br />
                  <b>County:  </b> {site.County}<br />
                  <b>Elevation in Feet: </b>: {site.ElevationFeet}<br />
                  <b>Latitude:  </b> {site.Latitude}<br />
                  <b>Longitude: </b> {site.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {site.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {site.USGS75Min}<br />
                </div>
                </Popup> 
              </Marker>
            ))}    
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Replicated Sites">
              <LayerGroup>
                    {recreatedSites.map(recSite => (
              <Marker
              key = {recSite.id}
              position = {[recSite.Latitude, recSite.Longitude]}
              eventHandlers={{
                click: (e) => {
                  
                  var tempOriginal = recSite.Directions.split(" ");
                  var tempReplication = recSite.Directions.split(" ");
                  //console.log(tempReplication);
                  //console.log(tempOriginal);
                  var numLinks = tempOriginal.length;
                  for(var i = 0; i < numLinks; i++)
                  {
                    tempOriginal[i] = imgSource + recSite.imgRecreated + tempOriginal[i] + '/' + tempOriginal[i] + '-Original.jpg';
                    tempReplication[i] = imgSource + recSite.imgRecreated + tempReplication[i] + '/' + tempReplication[i] + '-Replication.jpg';
                  }
                  
                  //console.log('rep',tempReplication);
                  //console.log('orig',tempOriginal);
                  ReplicationLink(tempReplication);
                  [originalImageLinks]=OriginalLink(tempOriginal);
                  

                },
              }}>
                <Popup class="imageInfo">
                
                <div className="sidebar">
                  <b>Site Name: </b> {recSite.SiteName}<br />
                  <b>Forest:  </b> {recSite.Forest}<br />
                  <b>County:  </b> {recSite.County}<br />
                  <b>Elevation in Feet: </b>: {recSite.ElevationFeet}<br />
                  <b>Latitude:  </b> {recSite.Latitude}<br />
                  <b>Longitude: </b> {recSite.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {recSite.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {recSite.USGS75Min}<br />
                  {originalImageLinks}<br />
                  
                </div>
                
                
                
                </Popup> 
              </Marker>
            ))}    
            </LayerGroup>
          </LayersControl.Overlay>
          {/*<LayersControl.Overlay name="Sites With Only Historical Images">
              <LayerGroup>
                    {originalSites.map(orSite => (
              <Marker
              key = {orSite.id}
              position = {[orSite.Latitude, orSite.Longitude]}
              eventHandlers={{
                click: (e) => {
                  console.log('marker clicked', e)
                },
              }}>
                <Popup>
                <div className="sidebar">
                  <b>Site Name: </b> {orSite.SiteName}<br />
                  <b>Forest:  </b> {orSite.Forest}<br />
                  <b>County:  </b> {orSite.County}<br />
                  <b>Elevation in Feet: </b>: {orSite.ElevationFeet}<br />
                  <b>Latitude:  </b> {orSite.Latitude}<br />
                  <b>Longitude: </b> {orSite.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {orSite.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {orSite.USGS75Min}<br />
                </div>
                </Popup> 
              </Marker>
            ))}    
            </LayerGroup>
          </LayersControl.Overlay>



          <LayersControl.Overlay name="Unscanned Sites">
              <LayerGroup>
                    {unscannedSites.map(unSite => (
              <Marker
              key = {unSite.id}
              position = {[unSite.Latitude, unSite.Longitude]}
              eventHandlers={{
                click: (e) => {
                  console.log('marker clicked', e)
                },
              }}>
                <Popup>
                <div className="sidebar">
                  <b>Site Name: </b> {unSite.SiteName}<br />
                  <b>Forest:  </b> {unSite.Forest}<br />
                  <b>County:  </b> {unSite.County}<br />
                  <b>Elevation in Feet: </b>: {unSite.ElevationFeet}<br />
                  <b>Latitude:  </b> {unSite.Latitude}<br />
                  <b>Longitude: </b> {unSite.Longitude}<br />
                  <b>Township, Range, Section, Meridian:  </b> {unSite.TRSM}<br />
                  <b>USGS 7.5 min. map: </b> {unSite.USGS75Min}<br />
                </div>
                </Popup> 
              </Marker>
            ))}    
            </LayerGroup>
            </LayersControl.Overlay>*/}
        </LayersControl>
   
  </MapContainer>
    
  );
}
}