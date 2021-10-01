import * as React from 'react'
import { View, findNodeHandle } from 'react-native'
import Color from 'color'
import { RNZoomUs, RNZoomUsVideoView, NativeVideoProps } from './native'

export interface Props {
  style?: NativeVideoProps["style"]
  layout: NativeVideoProps["layout"]
}

export const VIDEO_ASPECT_MODE = {
  'VIDEO_ASPECT_ORIGINAL': 0,
  'VIDEO_ASPECT_FULL_FILLED': 1,
  'VIDEO_ASPECT_LETTER_BOX': 2,
  'VIDEO_ASPECT_PAN_AND_SCAN': 3,
  'VIDEO_ASPECT_TRUSTEE': 4,
}

const ZoomUsVideoView: React.FC<Props> = (props) => {
  const { layout = [], ...otherProps } = props

  const nativeLayout = layout.map(unit => {
    return Object.assign({}, unit, {
      x: Math.ceil(unit.x * 100),
      y: Math.ceil(unit.y * 100),
      width: Math.ceil(unit.width * 100),
      height: Math.ceil(unit.height * 100),
      background: Color(unit.background || '#000000').rgbNumber(),
    })
  })

  const nativeEl = React.useRef(null)

  React.useEffect(() => {
    (async function register() {
      if (nativeEl.current) {
        await RNZoomUs.addVideoView(findNodeHandle(nativeEl.current))
      }
    })()

    return () => {
      (async function unregister() {
        if (nativeEl.current) {
          await RNZoomUs.removeVideoView(findNodeHandle(nativeEl.current))
        }
      })()
    }
  }, [nativeEl.current])

  if (RNZoomUsVideoView) {
    return (
      <RNZoomUsVideoView
        ref={nativeEl}
        layout={nativeLayout}
        {...otherProps}
      />
    )
  } else {
    return (<View {...otherProps} />)
  }
}

export default ZoomUsVideoView
