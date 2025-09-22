import { faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Row } from "react-bootstrap";

export const MiniStatisticsCard = ({ title, count, percentage, icon }) => {

  const titText = title ?? '[title]';
  const iconFig = icon?.icon ?? faFaceFrown;
  const iconBg = icon?.bgColor ?? 'secondary';
  const perColor = percentage?.color ?? 'secondary';
  const perText = percentage?.text ?? '[00]';

  return (
    <Card>
      <Card.Body className="p-3">
        <Row>
          <Col xs="8">
            <div className="numbers">
              <p className="text-sm mb-0 text-capitalize font-weight-bold">{ titText }</p>
              <h5 className="font-weight-bolder mb-0">
                { count }
                <span className={ `text-${ perColor } text-sm font-weight-bolder ms-1`}>{ perText }</span>
              </h5>
            </div>
          </Col>
          <Col xs="4" className="d-flex align-items-center justify-content-end">
            <div className={`icon icon-shape bg-gradient-${ iconBg } shadow text-white border-radius-md d-flex align-items-center justify-content-center`}
              style={{ minWidth: '48px' }}
            >
              <FontAwesomeIcon icon={ iconFig } size="lg" className="opacity-10" aria-hidden="true" />
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default MiniStatisticsCard;
