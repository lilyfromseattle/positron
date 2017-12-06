import FileInput from '/client/components/file_input/index.jsx'
import Paragraph from '/client/components/rich_text/components/paragraph.coffee'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Header, IconRemove } from '@artsy/reaction-force/dist/Components/Publishing'
import { HeaderControls } from './controls/index.jsx'
import { PlainText } from '/client/components/rich_text/components/plain_text.jsx'

export class SectionHeader extends Component {
  static propTypes = {
    article: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    onChange: PropTypes.func
  }

  state = {
    progress: null
  }

  onChangeHero = (key, value) => {
    const { article, onChange } = this.props
    const hero = article.get('hero_section')
    hero[key] = value
    onChange('hero_section', hero)
    this.forceUpdate() // TODO - Dont force update
  }

  onProgress = (progress) => {
    this.setState({ progress })
  }

  renderTitle = () => {
    const { article, onChange } = this.props

    return (
      <PlainText
        content={article.get('title')}
        onChange={(key, value) => onChange('title', value)}
        placeholder='Title'
        name='title'
      />
    )
  }

  renderFeatureDeck = (hero) => {
    return (
      <PlainText
        content={hero.deck}
        onChange={(content) => this.onChangeHero('deck', content)}
        placeholder='Deck (optional)'
      />
    )
  }

  renderFileUpload (prompt) {
    return (
      <FileInput
        type='simple'
        onUpload={(src) => this.onChangeHero('url', src)}
        prompt={prompt}
        video
        onProgress={this.onProgress}
      />
    )
  }

  renderImage (hero) {
    const { type, url } = hero
    const isFullscreen = type && type === 'fullscreen'
    const hasUrl = url && url.length
    const prompt = isFullscreen ? 'Add Background' : 'Add Image or Video'

    if (isFullscreen && hasUrl) {
      return (
        <div className='edit-header__image-container has-image'>
          {this.renderFileUpload('Change Background')}
        </div>
      )
    } else if (hasUrl) {
      return (
        <div
          className='edit-header__remove'
          onClick={() => this.onChangeHero('url', '')}>
          <IconRemove />
        </div>
      )
    } else {
      return (
        <div className='edit-header__image-container' data-has-image={false}>
          {this.renderFileUpload(prompt)}
          {this.state.progress && this.renderProgress()}
        </div>
      )
    }
  }

  renderProgress = () => {
    return (
      <div className='upload-progress-container'>
        <div
          className='upload-progress'
          style={{width: (this.state.progress * 100) + '%'}} />
      </div>
    )
  }

  renderLeadParagraph = () => {
    const { article, onChange } = this.props

    return (
      <Paragraph
        html={article.get('lead_paragraph')}
        onChange={(input) => onChange('lead_paragraph', input)}
        placeholder='Lead Paragraph (optional)'
        type='lead_paragraph'
        linked={false}
        stripLinebreaks
        layout={article.get('layout')}
      />
    )
  }

  render () {
    const { article, channel } = this.props
    const isFeature = article.get('layout') === 'feature'
    const isClassic = article.get('layout') === 'classic'
    const hero = article.get('hero_section')

    if (isClassic) {
      return (
        <div className='edit-header'>
          <Header article={article.attributes} date={article.getPublishDate()}>
            {this.renderTitle()}
            {this.renderLeadParagraph()}
          </Header>
        </div>
      )
    } else {
      const headerType = isFeature ? (hero.type) || 'text' : ''

      return (
        <div
          className={'edit-header ' + headerType}
          data-type={headerType}
        >
          {isFeature &&
            <HeaderControls
              onChange={this.onChangeHero}
              article={article}
              channel={channel}
              hero={hero}
            />
          }

          <Header article={article.attributes} date={article.getPublishDate()}>
            <span>Missing Vertical</span>
            {this.renderTitle()}
            {isFeature && this.renderFeatureDeck(hero)}
            {isFeature && this.renderImage(hero)}
          </Header>
        </div>
      )
    }
  }
}
