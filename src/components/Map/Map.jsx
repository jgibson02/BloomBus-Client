// Framework and third-party non-ui
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { fromJS } from 'immutable';

// Component specific modules (Component-styled, etc.)
import CustomMapController from './CustomMapController';
import { StyledGeolocateControl, StyledNavigationControl } from './Map-styled';

// App components
import StopMarker from '../StopMarker';
import ShuttleMarker from './ShuttleMarker';

// Third-party components (buttons, icons, etc.)
import ReactMapGL from 'react-map-gl';

// JSON

// CSS

const StopMarkerLayer = ({ stops, selectedStop, selectedLoopStops, onStopSelect, isInteracting }) =>
  stops &&
  Object.entries(stops).map(([stopKey, stop]) => {
    const selected = selectedStop === stopKey;
    const disabled = selectedLoopStops.length > 0 && !selectedLoopStops.includes(stopKey);
    return (
      <StopMarker
        key={stopKey}
        stop={stop}
        selected={selected}
        disabled={disabled}
        onStopSelect={onStopSelect}
        isInteracting={isInteracting}
      />
    );
  });

class Map extends Component {
  state = {
    mapStyle: null,
    isInteracting: false
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_MAPSTYLE_URL)
      .then(res => res.json())
      .then(json => {
        const mapStyle = json;
        mapStyle.sources.loops = {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.props.loops
          }
        };
        mapStyle.layers.push({
          id: 'loops',
          type: 'line',
          source: 'loops',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-width': 3,
            'line-color': ['get', 'color']
          }
        });
        this.setState({
          mapStyle: fromJS(mapStyle)
        });
      });
  }

  onInteractionStateChange = interactionState => {
    const { isPanning, isDragging, isZooming } = interactionState;
    this.setState({
      isInteracting: isPanning || isDragging || isZooming
    });
  };

  render() {
    const {
      match,
      viewport,
      mapOptions,
      mapContainerRef,
      shuttles,
      loops,
      stops,
      loopStops,
      onViewportChange,
      onMapClick,
      onStopSelect,
      onShuttleSelect
    } = this.props;
    const { maxZoom, minZoom } = mapOptions;
    const { stopKey: selectedStopKey, loopKey: selectedLoopKey } = match.params;
    const selectedLoopStops = (loopStops && loopStops[selectedLoopKey]) || [];

    return (
      <div ref={mapContainerRef} style={{ flex: 1 }}>
        <ReactMapGL
          {...viewport}
          mapStyle={this.state.mapStyle}
          controller={new CustomMapController()}
          onInteractionStateChange={this.onInteractionStateChange}
          onViewportChange={onViewportChange}
          onClick={onMapClick}
          minZoom={minZoom}
          maxZoom={maxZoom}
          width="100%"
          height="100%"
        >
          <StyledGeolocateControl positionOptions={{ enableHighAccuracy: true }} trackUserLocation />
          <StyledNavigationControl showCompass showZoom />
          <StopMarkerLayer
            stops={stops}
            selectedStop={selectedStopKey}
            selectedLoopStops={selectedLoopStops}
            onStopSelect={onStopSelect}
            isInteracting={this.state.isInteracting}
          />
          {shuttles &&
            Object.keys(shuttles).map(shuttleKey => {
              const shuttle = shuttles[shuttleKey];
              return (
                <ShuttleMarker
                  shuttle={shuttle}
                  key={shuttleKey}
                  shuttleKey={shuttleKey} // must explicitly pass as separate prop from `key`
                  loops={loops}
                  isInteracting={this.state.isInteracting}
                  onShuttleSelect={onShuttleSelect}
                />
              );
            })}
        </ReactMapGL>
      </div>
    );
  }
}

Map.defaultProps = {
  stops: {},
  shuttles: {},
  mapOptions: {}
};

export default withRouter(Map);
