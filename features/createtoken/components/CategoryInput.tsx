import { useIBCAssetInfo } from 'hooks/useIBCAssetInfo'
import { useTokenDollarValue } from 'hooks/useTokenDollarValue'
import {
  ArrowUpIcon,
  Button,
  dollarValueFormatterWithDecimals,
  ImageForTokenLogo,
  styled,
  Text,
} from 'junoblocks'
import { HTMLProps, useState } from 'react'

type CategoryInputProps = Exclude<HTMLProps<HTMLDivElement>, 'children'> & {
  label: string
  value: string
}

export const CategoryInput = ({
  label,
  value,
  ...htmlProps
}: CategoryInputProps) => {
  
  

  return (
    <>
      <StyledElementForCard
        
        {...(htmlProps as any)}
        kind="wrapper"
      >
        <StyledElementForCard kind="content">
          <StyledElementForToken>
            
            <div>
              <Text variant="primary">
                 {label}
              </Text>
            </div>
          </StyledElementForToken>
        </StyledElementForCard>

        <StyledElementForCard kind="actions">
          <div>
            {/* <Text variant="primary">
                {value}
            </Text> */}

          <Text variant="primary">
            <StyledInput
              ref={inputRef}
              type="number"
              lang="en-US"
              placeholder="0.0"
              min={0}
              value={value}
              onChange={
                !disabled ? ({ target: { value } }) => setValue(value) : undefined
              }
              autoComplete="off"
              readOnly={disabled}
              style={{ width: `${calculateCharactersLength(value)}ch` }}
              {...inputProps}
            />
          </Text>
    
          </div>
        </StyledElementForCard>
      </StyledElementForCard>

      
    </>
  )
}

const StyledElementForCard = styled('div', {
  variants: {
    kind: {
      wrapper: {
        background: '$colors$dark10',
        borderRadius: '$2',
        padding: '$9 $12',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      },
      content: {
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: '$space$10',
        position: 'relative',
        zIndex: 1,
      },
      actions: {
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: '$space$6',
        position: 'relative',
        zIndex: 1,
      },
    },
    active: {
      true: {
        boxShadow: '$light',
        border: '1px solid $borderColors$default',
        backgroundColor: '$base',
      },
    },
  },
})

const StyledElementForToken = styled('div', {
  display: 'grid',
  gridAutoFlow: 'column',
  columnGap: '$6',
  alignItems: 'center',
})
