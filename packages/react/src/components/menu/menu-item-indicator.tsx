import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import { type HTMLProps, type PolymorphicProps, ark } from '../factory'
import { useMenuContext } from './use-menu-context'
import { useMenuOptionItemPropsContext } from './use-menu-option-item-props-context'

export interface MenuItemIndicatorBaseProps extends PolymorphicProps {}
export interface MenuItemIndicatorProps extends HTMLProps<'div'>, MenuItemIndicatorBaseProps {}

export const MenuItemIndicator = forwardRef<HTMLDivElement, MenuItemIndicatorProps>((props, ref) => {
  const menu = useMenuContext()
  const optionItemProps = useMenuOptionItemPropsContext()
  const mergedProps = mergeProps(menu.getItemIndicatorProps(optionItemProps), props)

  return <ark.div {...mergedProps} ref={ref} />
})

MenuItemIndicator.displayName = 'MenuItemIndicator'
