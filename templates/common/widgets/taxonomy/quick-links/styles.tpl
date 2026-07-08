<style>
  .quick-links-widget-container {
    background-color: #fff;
    display: flex;
    flex-direction: column;
  }

  .quick-links-groups {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .quick-links-groups .quick-links-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .quick-links-groups .quick-links-group-heading {
    color: #2d2d2d;
    font-weight: 400;
    font-size: 13px;
    line-height: 20px;
  }

  .quick-links-items {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(3, 1fr);
  }

  .quick-links-items a {
    --fontSize: 12px;
    --lineHeight: 14px;

    display: flex;
    gap: 5px;
    align-items: center;
    text-decoration: none;
    color: #0B65F0;
  }

  .quick-links-items a * {
    font-weight: 400;
    font-size: var(--fontSize);
    line-height: var(--lineHeight);
  }

  .quick-links-items a::before {
    content: "\2022";
    font-size: var(--fontSize);
    line-height: var(--lineHeight);
  }

  @media (max-width: 768px) {
    .quick-links-groups {
      gap: 10px;
    }

    .quick-links-items {
      gap: 12px;
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
