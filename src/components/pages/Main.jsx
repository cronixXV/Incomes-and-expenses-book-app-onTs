import React from 'react'
import { Container, Button, Carousel } from 'react-bootstrap'
import { BsSpeedometer2 } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import slide1 from '../../img/slides/slide1.jpg'
import slide2 from '../../img/slides/slide2.jpg'
import slide3 from '../../img/slides/slide3.jpg'

export default function Main() {
  const { t } = useTranslation()

  return (
    <>
      <Container
        fluid
        className="p-5 mb-5 bg-light border rounded-3"
      >
        <h1 className="display-5 fw-bold">{t('index.title')}</h1>
        <p
          className="fs-4 mb-4"
          dangerouslySetInnerHTML={{ __html: t('index.description') }}
        />
        <Link to="/incomes">
          <Button
            size="lg"
            className="custom-btn-main"
          >
            <BsSpeedometer2
              className="me-2"
              size="24"
            />
            {t('index.button')}
          </Button>
        </Link>
      </Container>

      <Carousel variant="dark">
        <Carousel.Item>
          <img
            className="d-block w-100 rounded-3"
            src={slide1}
            alt={t('index.slider.slideAlt') + ' 1'}
            style={{ maxHeight: '550px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <div className="bg-light p-3 opacity-75 rounded-2">
              <h3>{t('index.slider.slide1.title')}</h3>
              <p>{t('index.slider.slide1.text')}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 rounded-3"
            src={slide2}
            alt={t('index.slider.slideAlt') + ' 2'}
            style={{ maxHeight: '550px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <div className="bg-light p-3 opacity-75 rounded-2">
              <h3>{t('index.slider.slide2.title')}</h3>
              <p>{t('index.slider.slide2.text')}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100 rounded-3"
            src={slide3}
            alt={t('index.slider.slideAlt') + ' 3'}
            style={{ maxHeight: '550px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <div className="bg-light p-3 opacity-75 rounded-2">
              <h3>{t('index.slider.slide3.title')}</h3>
              <p>{t('index.slider.slide3.text')}</p>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </>
  )
}
