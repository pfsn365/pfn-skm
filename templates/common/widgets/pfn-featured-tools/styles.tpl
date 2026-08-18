<style>
  .pfn-featured-tools-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .pfn-featured-tools-grid .pfn-tool-card {
    align-items: center;
    background: #fff;
    border: 1px solid #e4e7ec;
    border-radius: 8px;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    padding: 12px 14px;
    text-decoration: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }

  .pfn-featured-tools-grid .pfn-tool-card:hover {
    border-color: #0b65f0;
    box-shadow: 0 2px 8px rgba(11, 101, 240, 0.12);
  }

  .pfn-featured-tools-grid .pfn-tool-name {
    color: #1b2333;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.35;
  }

  .pfn-featured-tools-grid .pfn-tool-arrow {
    border-right: 2px solid #98a2b3;
    border-top: 2px solid #98a2b3;
    flex: none;
    height: 7px;
    transform: rotate(45deg);
    transition: border-color 0.15s ease, transform 0.15s ease;
    width: 7px;
  }

  .pfn-featured-tools-grid .pfn-tool-card:hover .pfn-tool-arrow {
    border-color: #0b65f0;
    transform: translateX(2px) rotate(45deg);
  }

  .pfn-featured-tools-grid .pfn-tool-card.is-featured {
    background: #fffdf5;
    border-color: #f0d489;
    box-shadow: inset 3px 0 0 #f9c511;
  }

  .pfn-featured-tools-grid .pfn-tool-card.is-featured .pfn-tool-name {
    font-weight: 700;
  }

  .pfn-featured-tools-grid .pfn-tool-card.is-featured:hover {
    border-color: #f9c511;
    box-shadow: inset 3px 0 0 #f9c511, 0 2px 8px rgba(249, 197, 17, 0.28);
  }

  .pfn-featured-tools-grid .pfn-tool-card.is-featured:hover .pfn-tool-arrow {
    border-color: #b8890a;
  }

  @media (max-width: 1023px) {
    .pfn-featured-tools-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 767px) {
    .pfn-featured-tools-grid {
      gap: 8px;
    }

    .pfn-featured-tools-grid .pfn-tool-card {
      padding: 11px 12px;
    }

    .pfn-featured-tools-grid .pfn-tool-name {
      font-size: 12px;
    }
  }

  @media (max-width: 419px) {
    .pfn-featured-tools-grid {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
