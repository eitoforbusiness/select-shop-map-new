// アニメーション設定
export const animations = {
  // フェードイン
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  // スライドアップ
  slideUp: {
    from: { 
      opacity: 0, 
      transform: 'translateY(20px)' 
    },
    to: { 
      opacity: 1, 
      transform: 'translateY(0)' 
    },
  },
  
  // スライドダウン
  slideDown: {
    from: { 
      opacity: 0, 
      transform: 'translateY(-20px)' 
    },
    to: { 
      opacity: 1, 
      transform: 'translateY(0)' 
    },
  },
  
  // スケールイン
  scaleIn: {
    from: { 
      opacity: 0, 
      transform: 'scale(0.9)' 
    },
    to: { 
      opacity: 1, 
      transform: 'scale(1)' 
    },
  },
  
  // バウンス
  bounce: {
    '0%': { 
      transform: 'scale(1)' 
    },
    '50%': { 
      transform: 'scale(1.05)' 
    },
    '100%': { 
      transform: 'scale(1)' 
    },
  },
  
  // パルス
  pulse: {
    '0%': { 
      transform: 'scale(1)' 
    },
    '50%': { 
      transform: 'scale(1.05)' 
    },
    '100%': { 
      transform: 'scale(1)' 
    },
  },
  
  // ローテーション
  rotate: {
    from: { 
      transform: 'rotate(0deg)' 
    },
    to: { 
      transform: 'rotate(360deg)' 
    },
  },
};

// トランジション設定
export const transitions = {
  // 標準的なトランジション
  standard: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // より滑らかなトランジション
  smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // より速いトランジション
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // より遅いトランジション
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  
  // バウンス効果
  bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // イージング
  easeIn: 'all 0.3s cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'all 0.3s cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ホバー効果
export const hoverEffects = {
  // リフト効果
  lift: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  
  // スケール効果
  scale: {
    transform: 'scale(1.02)',
  },
  
  // グロウ効果
  glow: {
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
  },
  
  // シャドウ効果
  shadow: {
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

// キーフレーム定義
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  
  slideUp: `
    @keyframes slideUp {
      from { 
        opacity: 0; 
        transform: translateY(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `,
  
  slideDown: `
    @keyframes slideDown {
      from { 
        opacity: 0; 
        transform: translateY(-20px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }
  `,
  
  scaleIn: `
    @keyframes scaleIn {
      from { 
        opacity: 0; 
        transform: scale(0.9); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    }
  `,
  
  bounce: `
    @keyframes bounce {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  
  pulse: `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
  `,
  
  rotate: `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }
  `,
};
