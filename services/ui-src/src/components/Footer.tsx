import { Container } from "react-bootstrap";
import { helpDeskContact } from "../libs/contacts";
import { HelpSection } from "./HelpSection";

function TopFooter() {
  return (
    <section className="footer-top-container">
      <Container>
        <div className="footer-wrapper footer-top-wrapper">
          <div>
            <img src="/footer/logo-MedicaidGov.svg" alt="Medicaid.gov logo" />
          </div>
          <div className="footer-government-blurb">
            <div className="footer-fed-gov-container">
              <img
                src="/footer/depthealthhumanservices_usa.svg"
                alt="Department of Health and Human Services logo"
              ></img>
            </div>
            <div className="footer-fed-gov-text">
              A federal government website managed and paid for by the U.S.
              Centers for Medicare and Medicaid Services and part of the MACPro
              suite.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function BottomFooter() {
  return (
    <div className="footer-bottom-container">
      <Container>
        <div className="footer-wrapper">
          <div>
            Email{" "}
            <a
              className="footer-email"
              href={`mailto:${helpDeskContact.email}`}
            >
              {" "}
              {helpDeskContact.email}
            </a>{" "}
            for help or feedback.
          </div>
          <div>7500 Security Boulevard Baltimore, MD 21244</div>
        </div>
      </Container>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <HelpSection />
      <TopFooter />
      <BottomFooter />
    </footer>
  );
}

export default Footer;
