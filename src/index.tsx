import * as React from 'react'
import * as topojson from 'topojson-client'

import INDIA_JSON from './data/india.json'
import MapElements from './components/MapElements/index'
import HoverInfo from './components/HoverInfo'
import TitleStyle from './components/TitleStyle'

// @ts-ignore
const TOPO_INDIA_DATA = topojson.feature(INDIA_JSON, INDIA_JSON.objects['india']).features

export interface MapLayout {
  title: string
  legendTitle: string
  startColor: string
  endColor: string
  hoverTitle: string
  noDataColor: string
  borderColor: string
  hoverColor: string
  width?: number
  height?: number
}

export interface RegionData {
  [key: string]: number
}

interface IDatamapBox {
  regionData: RegionData
  mapLayout: MapLayout
}

const DEFAULT_MAP_LAYOUT = {
  title: '',
  legendTitle: '',
  startColor: 'orange',
  endColor: 'red',
  hoverTitle: 'Count',
  noDataColor: '#f5f5f5',
  borderColor: '#8D8D8D',
  hoverColor: 'green'
}

class DatamapBox extends React.Component<IDatamapBox> {
  mapLayout = { ...DEFAULT_MAP_LAYOUT, ...this.props.mapLayout }

  state = {
    infoWindowPosition: {
      x: 0,
      y: 0
    },
    isInfoWindowActive: false,
    activeState: {
      name: '',
      value: 0
    },
    regionData: this.props.regionData
  }

  constructor(props: IDatamapBox) {
    super(props)
    this.mouseMoveOnDatamap = this.mouseMoveOnDatamap.bind(this)
    this.mouseEnterOnDatamap = this.mouseEnterOnDatamap.bind(this)
    this.mouseLeaveDatamap = this.mouseLeaveDatamap.bind(this)
    this.mouseEnterOnState = this.mouseEnterOnState.bind(this)
    this.calculateExtremeValues = this.calculateExtremeValues.bind(this)
  }

  static getDerivedStateFromProps(props: IDatamapBox, state: any) {
    if (props.regionData !== state.regionData) {
      return {
        regionData: props.regionData
      }
    }
    return null
  }

  calculateExtremeValues(region: RegionData) {
    return {
      min: Math.min(...Object.values(region)),
      max: Math.max(...Object.values(region))
    }
  }

  mouseMoveOnDatamap(e: any) {
    this.setState({
      infoWindowPosition: { x: e.clientX, y: e.clientY }
    })
  }

  mouseEnterOnDatamap() {
    this.setState({
      isInfoWindowActive: true
    })
  }

  mouseLeaveDatamap() {
    this.setState({
      isInfoWindowActive: false
    })
  }

  mouseEnterOnState(name: string, value: number) {
    this.setState({
      activeState: {
        name,
        value
      }
    })
  }

  render() {
    return (
      <>
        <MapElements
          topoData={TOPO_INDIA_DATA}
          mapLayout={this.mapLayout}
          regionData={this.state.regionData}
          extremeValues={this.calculateExtremeValues(this.state.regionData)}
          mouseMoveOnDatamap={this.mouseMoveOnDatamap}
          mouseEnterOnDatamap={this.mouseEnterOnDatamap}
          mouseLeaveDatamap={this.mouseLeaveDatamap}
          mouseEnterOnState={this.mouseEnterOnState}
          infoWindowPos={this.state.infoWindowPosition}
        />
        <HoverInfo
          active={this.state.isInfoWindowActive}
          position={this.state.infoWindowPosition}
          name={this.state.activeState.name}
          value={this.state.activeState.value}
          valueTitle={this.mapLayout.hoverTitle || ''}
        />

        <TitleStyle />
      </>
    )
  }
}

export default DatamapBox