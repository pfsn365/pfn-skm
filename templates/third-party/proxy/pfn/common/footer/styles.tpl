<style>
  .pfn-footer {
    background-color: #000000;
    color: #9ca3af;
    padding: 40px 0;
    margin-top: 64px;
  }

  .sk-proxied-page .pfn-footer .pfn-footer-copyright p,
  .sk-proxied-page .pfn-footer svg path {
    color: #9ca3af;
  }

  .pfn-footer-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .pfn-footer-columns {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
    margin-bottom: 40px;
  }

  .pfn-footer-column {
    display: flex;
    flex-direction: column;
  }

  .pfn-footer-column-title {
    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
    padding-bottom: 8px;
    text-align: left;
  }

  .pfn-footer-column-subtitle {
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    margin-top: 24px;
    margin-bottom: 16px;
    padding-bottom: 8px;
    text-align: left;
  }

  .pfn-footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pfn-footer-links li {
    margin-bottom: 8px;
    text-align: left;
  }

  .pfn-footer-link {
    color: #9ca3af;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;
  }

  .pfn-footer-link:hover {
    color: #ffffff;
  }

  .pfn-footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0;
    flex-wrap: wrap;
    gap: 20px;
  }

  .pfn-footer-social {
    display: flex;
    gap: 16px;
  }

  .pfn-footer-social-link {
    color: #9ca3af;
    font-size: 18px;
    transition: color 0.3s;
    text-decoration: none;
  }

  .pfn-footer-social-link:hover {
    color: #dc2626;
  }

  .pfn-footer-social-icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }

  .pfn-footer-copyright {
    text-align: right;
    font-size: 12px;
    color: #6b7280;
  }

  .pfn-footer-copyright p {
    margin: 2px 0;
  }

  .pfn-footer ul li {
    padding-left: unset;
  }
  
  .pfn-footer ul li::before {
    content: unset;
  }

  @media (max-width: 768px) {
    .pfn-footer-columns {
      grid-template-columns: repeat(1, 1fr);
    }
  }
</style>
