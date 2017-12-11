import React from 'react'
import Article from '../../../../../../../../models/article'
import LayoutControls from '../LayoutControls.jsx'
import ModalCover from '../ModalCover.jsx'
import VideoControls from '../VideoControls.jsx'
import { HeaderControls } from '../index.jsx'
import { Controls } from '../../../video/controls.jsx'
import { mount } from 'enzyme'
import {
  Fixtures,
  IconLayoutFullscreen,
  IconLayoutSplit,
  IconLayoutText
} from '@artsy/reaction-force/dist/Components/Publishing'

describe('Feature Header Controls', () => {
  describe('LayoutControls', () => {
    const props = {
      article: new Article(),
      hero: {},
      onChange: jest.fn(),
      onClick: jest.fn(),
      onProgress: jest.fn()
    }

    it('renders change header controls', () => {
      const component = mount(
        <HeaderControls {...props} />
      )
      expect(component.html()).toMatch('class="edit-header--controls-open"')
      expect(component.html()).toMatch('Change Header')
      expect(component.state().isLayoutOpen).toBe(false)
    })

    it('opens the menu on click', () => {
      const component = mount(
        <HeaderControls {...props} />
      )
      component.find('.edit-header--controls-open').simulate('click')
      expect(component.state().isLayoutOpen).toBe(true)
      expect(component.find(LayoutControls).exists()).toEqual(true)
      expect(component.find(ModalCover).exists()).toEqual(true)
      expect(component.find(IconLayoutFullscreen).length).toBe(1)
      expect(component.find(IconLayoutSplit).length).toBe(1)
      expect(component.find(IconLayoutText).length).toBe(1)
    })

    it('changes the layout click', () => {
      const component = mount(
        <HeaderControls {...props} />
      )
      component.find('.edit-header--controls-open').simulate('click')
      component.find('a').first().simulate('click')
      expect(props.onChange.mock.calls[0][0]).toMatch('type')
      expect(props.onChange.mock.calls[0][1]).toMatch('text')
    })
  })

  describe('VideoControls', () => {
    let props

    beforeEach(() => {
      props = {
        article: new Article(Fixtures.StandardArticle),
        channel: {
          isArtsyChannel: () => false
        },
        hero: {
          type: 'basic',
          url: 'foo',
          cover_image_url: 'bar'
        },
        onChange: jest.fn(),
        onClick: jest.fn(),
        onProgress: jest.fn()
      }
    })

    it('does not render controls if not a BasicHeader type', () => {
      props.hero.type = 'video'
      const component = mount(
        <HeaderControls {...props} />
      )
      expect(component.html()).not.toMatch('class="edit-header--video')
    })

    it('renders embed video controls', () => {
      const component = mount(
        <HeaderControls {...props} />
      )
      expect(component.html()).toMatch('class="edit-header--video')
      expect(component.html()).toMatch('Embed Video')
      expect(component.state().isVideoOpen).toBe(false)
    })

    it('opens the embed menu on click', () => {
      const component = mount(
        <HeaderControls {...props} />
      )
      component.find('.edit-header--video-open').simulate('click')
      expect(component.state().isVideoOpen).toBe(true)
      expect(component.find(VideoControls).exists()).toEqual(true)
      expect(component.find(Controls).exists()).toEqual(true)
      expect(component.find(ModalCover).exists()).toEqual(true)
    })
  })
})
