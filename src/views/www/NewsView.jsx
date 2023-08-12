import React from 'react'
import BasicLayout from '../../layouts/basic/BasicLayout';

import imgHombreNegocios from '../../assets/img/hombre-negocios-usado-su-movil.jpg';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NewsItem from './components/NewsItem';

import news from './data/newsData';

export const NewsView = () => {
  return (
    <BasicLayout>
      <header>
        <div className="page-header min-vh-25 relative" style={{ backgroundImage: `url(${ imgHombreNegocios })`}}>
          <span className="mask bg-gradient-dark"></span>
          <Container>
            <Row>
              <Col lg="7" className="text-center mx-auto">
                <h1 className="text-white text-shadow pt-5">News</h1>
              </Col>
            </Row>
          </Container>
        </div>
      </header>
      <section className="my-5 pt-5">
        <Container>
          <Row>
            <Col lg="8" className="mx-auto">
              <ListGroup>
                {
                  news.map(item => 
                    <NewsItem 
                      key={ item.key }
                      title={ item.title }
                      subtitle={ item.subtitle }
                    >
                      { item.content }
                    </NewsItem>
                  )
                }
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </section>
    </BasicLayout>
  )
}

export default NewsView;