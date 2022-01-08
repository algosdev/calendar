import { styled, css } from '@mui/system'
import React from 'react'
import { ReactSVG } from 'react-svg'
// import styled, { css } from 'styled-components'

const StyledSVGIcon = styled(ReactSVG)`
  div {
    display: inline-flex;
    align-items: center;
    justify-items: center;
    margin: ({margin}) => margin;
  }
  svg {
    fill: black;
    ${({ width, height, opacity }) =>
      width
        ? css`
            width: ${width}px;
          `
        : height
        ? css`
            height: ${width}px;
          `
        : opacity
        ? css`
            opacity: ${opacity};
          `
        : ''}
    ${({ transform }) =>
      transform &&
      css`
        transform: ${transform};
      `}
    path {
      ${({ color }) =>
        color &&
        css`
          fill: ${color};
        `}
    }
  }
`

const Icon = ({ name, color, width, height, transform, opacity, ...rest }) => (
  <StyledSVGIcon
    src={`${process.env.PUBLIC_URL}/vectors/${name}.svg`}
    color={color}
    height={height}
    width={width}
    wrapper='span'
    opacity={opacity}
    transform={transform}
    {...rest}
  />
)

export default Icon
