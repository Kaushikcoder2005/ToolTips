import React, { useState, useRef, useEffect } from 'react';
import { Copy, Sun, Moon, Image, Sparkles } from 'lucide-react';

// Reusable Tooltip Component
const Tooltip = ({ 
  children, 
  content, 
  trigger = 'hover', 
  position = 'top', 
  shape = 'rounded',
  backgroundColor = '#333333',
  textColor = '#ffffff',
  width = 200,
  fontSize = 14,
  icon = null,
  animation = 'fade',
  isVisible,
  onVisibilityChange
}) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltip = (e) => {
    if (trigger === 'hover' || trigger === 'focus') {
      setVisible(true);
      updatePosition(e);
    }
    onVisibilityChange?.(true);
  };

  const hideTooltip = () => {
    if (trigger === 'hover' || trigger === 'focus') {
      setVisible(false);
    }
    onVisibilityChange?.(false);
  };

  const toggleTooltip = (e) => {
    if (trigger === 'click') {
      const newVisible = !visible;
      setVisible(newVisible);
      if (newVisible) updatePosition(e);
      onVisibilityChange?.(newVisible);
    }
  };

  const updatePosition = (e) => {
    if (!triggerRef.current) return;
    
    const rect = triggerRef.current.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    let x, y;
    
    switch (position) {
      case 'top':
        x = rect.left + scrollLeft + rect.width / 2;
        y = rect.top + scrollTop - 10;
        break;
      case 'bottom':
        x = rect.left + scrollLeft + rect.width / 2;
        y = rect.bottom + scrollTop + 10;
        break;
      case 'left':
        x = rect.left + scrollLeft - 10;
        y = rect.top + scrollTop + rect.height / 2;
        break;
      case 'right':
        x = rect.right + scrollLeft + 10;
        y = rect.top + scrollTop + rect.height / 2;
        break;
      default:
        x = rect.left + scrollLeft + rect.width / 2;
        y = rect.top + scrollTop - 10;
    }
    
    setCoords({ x, y });
  };

  useEffect(() => {
    if (isVisible !== undefined) {
      setVisible(isVisible);
    }
  }, [isVisible]);

  const getShapeStyles = () => {
    const base = {
      backgroundColor,
      color: textColor,
      width: `${width}px`,
      fontSize: `${fontSize}px`,
      padding: '8px 12px',
      borderRadius: shape === 'rectangle' ? '0px' : shape === 'rounded' ? '8px' : '12px',
      position: 'absolute',
      zIndex: 1000,
      maxWidth: '300px',
      wordWrap: 'break-word',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };

    // Position-based transforms
    switch (position) {
      case 'top':
        base.transform = 'translateX(-50%) translateY(-100%)';
        break;
      case 'bottom':
        base.transform = 'translateX(-50%)';
        break;
      case 'left':
        base.transform = 'translateX(-100%) translateY(-50%)';
        break;
      case 'right':
        base.transform = 'translateY(-50%)';
        break;
      default:
        base.transform = 'translateX(-50%) translateY(-100%)';
    }

    return base;
  };

  const getArrowStyles = () => {
    const arrowSize = 6;
    const arrowStyles = {
      position: 'absolute',
      width: 0,
      height: 0,
      borderStyle: 'solid',
    };

    switch (position) {
      case 'top':
        return {
          ...arrowStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`,
          borderColor: `${backgroundColor} transparent transparent transparent`,
        };
      case 'bottom':
        return {
          ...arrowStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent ${backgroundColor} transparent`,
        };
      case 'left':
        return {
          ...arrowStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`,
          borderColor: `transparent transparent transparent ${backgroundColor}`,
        };
      case 'right':
        return {
          ...arrowStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          borderWidth: `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
        };
      default:
        return arrowStyles;
    }
  };

  const getAnimationClass = () => {
    if (!visible) return 'tooltip-hidden';
    
    switch (animation) {
      case 'slide':
        return 'tooltip-slide';
      case 'scale':
        return 'tooltip-scale';
      default:
        return 'tooltip-fade';
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onClick={toggleTooltip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTooltip(e);
          }
        }}
        tabIndex={trigger === 'focus' ? 0 : undefined}
        style={{ display: 'inline-block', cursor: 'pointer' }}
        role={trigger === 'click' ? 'button' : undefined}
        aria-describedby={visible ? 'tooltip' : undefined}
      >
        {children}
      </div>
      
      {visible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          aria-live="polite"
          className={getAnimationClass()}
          style={{
            ...getShapeStyles(),
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          {shape === 'speech' && <div style={getArrowStyles()} />}
          {icon && <span>{icon}</span>}
          <span>{content}</span>
        </div>
      )}
      
      <style jsx>{`
        .tooltip-fade {
          opacity: 1;
          transition: opacity 0.2s ease-in-out;
        }
        
        .tooltip-slide {
          opacity: 1;
          transform: translateX(-50%) translateY(-100%) translateY(0);
          transition: all 0.2s ease-in-out;
        }
        
        .tooltip-scale {
          opacity: 1;
          transform: translateX(-50%) translateY(-100%) scale(1);
          transition: all 0.2s ease-in-out;
        }
        
        .tooltip-hidden {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </>
  );
};

// Main Sandbox Application
const TooltipsSandbox = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [config, setConfig] = useState({
    trigger: 'hover',
    position: 'top',
    shape: 'rounded',
    backgroundColor: '#333333',
    textColor: '#ffffff',
    width: 200,
    fontSize: 14,
    content: 'This is a sample tooltip',
    animation: 'fade',
    icon: null
  });
  
  const [previewVisible, setPreviewVisible] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateCode = () => {
    return `<Tooltip
  trigger="${config.trigger}"
  position="${config.position}"
  shape="${config.shape}"
  backgroundColor="${config.backgroundColor}"
  textColor="${config.textColor}"
  width={${config.width}}
  fontSize={${config.fontSize}}
  animation="${config.animation}"
  content="${config.content}"
>
  <button>Hover me!</button>
</Tooltip>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateCode());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code');
    }
  };

  const iconOptions = [
    { value: null, label: 'None' },
    { value: '💡', label: '💡 Light bulb' },
    { value: '⚠️', label: '⚠️ Warning' },
    { value: '✨', label: '✨ Sparkles' },
    { value: '📍', label: '📍 Pin' },
    { value: '🔥', label: '🔥 Fire' }
  ];

  return (
    <div className={`sandbox ${darkMode ? 'dark' : 'light'}`}>
      <div className="header">
        <h1>🛠️ Tooltips Sandbox</h1>
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="main-container">
        <div className="controls-panel">
          <h2>Configuration</h2>
          
          <div className="control-group">
            <label>Trigger Mechanism</label>
            <select 
              value={config.trigger} 
              onChange={(e) => updateConfig('trigger', e.target.value)}
            >
              <option value="hover">Hover</option>
              <option value="click">Click</option>
              <option value="focus">Focus</option>
            </select>
          </div>

          <div className="control-group">
            <label>Position</label>
            <select 
              value={config.position} 
              onChange={(e) => updateConfig('position', e.target.value)}
            >
              <option value="top">Top</option>
              <option value="right">Right</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
            </select>
          </div>

          <div className="control-group">
            <label>Shape</label>
            <select 
              value={config.shape} 
              onChange={(e) => updateConfig('shape', e.target.value)}
            >
              <option value="rectangle">Rectangle</option>
              <option value="rounded">Rounded</option>
              <option value="speech">Speech Bubble</option>
            </select>
          </div>

          <div className="control-group">
            <label>Background Color</label>
            <input 
              type="color" 
              value={config.backgroundColor}
              onChange={(e) => updateConfig('backgroundColor', e.target.value)}
            />
          </div>

          <div className="control-group">
            <label>Text Color</label>
            <input 
              type="color" 
              value={config.textColor}
              onChange={(e) => updateConfig('textColor', e.target.value)}
            />
          </div>

          <div className="control-group">
            <label>Width: {config.width}px</label>
            <input 
              type="range" 
              min="100" 
              max="400" 
              value={config.width}
              onChange={(e) => updateConfig('width', parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Font Size: {config.fontSize}px</label>
            <input 
              type="range" 
              min="10" 
              max="24" 
              value={config.fontSize}
              onChange={(e) => updateConfig('fontSize', parseInt(e.target.value))}
            />
          </div>

          <div className="control-group">
            <label>Animation</label>
            <select 
              value={config.animation} 
              onChange={(e) => updateConfig('animation', e.target.value)}
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="scale">Scale</option>
            </select>
          </div>

          <div className="control-group">
            <label>Icon</label>
            <select 
              value={config.icon || ''} 
              onChange={(e) => updateConfig('icon', e.target.value || null)}
            >
              {iconOptions.map(option => (
                <option key={option.label} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Tooltip Content</label>
            <textarea 
              value={config.content}
              onChange={(e) => updateConfig('content', e.target.value)}
              rows="3"
              placeholder="Enter tooltip content..."
            />
          </div>
        </div>

        <div className="preview-panel">
          <h2>Live Preview</h2>
          
          <div className="preview-area">
            <Tooltip
              trigger={config.trigger}
              position={config.position}
              shape={config.shape}
              backgroundColor={config.backgroundColor}
              textColor={config.textColor}
              width={config.width}
              fontSize={config.fontSize}
              content={config.content}
              animation={config.animation}
              icon={config.icon}
              isVisible={config.trigger === 'click' ? previewVisible : undefined}
              onVisibilityChange={setPreviewVisible}
            >
              <button className="preview-trigger">
                {config.trigger === 'hover' ? 'Hover me!' : 
                 config.trigger === 'click' ? 'Click me!' : 
                 'Focus me!'}
              </button>
            </Tooltip>
            
            <p className="preview-instructions">
              {config.trigger === 'hover' && 'Hover over the button to see the tooltip'}
              {config.trigger === 'click' && 'Click the button to toggle the tooltip'}
              {config.trigger === 'focus' && 'Tab to focus the button or click it'}
            </p>
          </div>

          <div className="code-section">
            <div className="code-header">
              <h3>Generated Code</h3>
              <button 
                className="copy-button"
                onClick={copyToClipboard}
                aria-label="Copy code to clipboard"
              >
                <Copy size={16} />
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="code-block">
              <code>{generateCode()}</code>
            </pre>
          </div>
        </div>
      </div>

      <style jsx>{`
        .sandbox {
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          transition: all 0.3s ease;
        }

        .sandbox.light {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
        }

        .sandbox.dark {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          color: #fff;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 600;
        }

        .theme-toggle {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: inherit;
          transition: all 0.2s ease;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .main-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .controls-panel, .preview-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .controls-panel h2, .preview-panel h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .control-group {
          margin-bottom: 1.2rem;
        }

        .control-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .control-group input, .control-group select, .control-group textarea {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          color: inherit;
          font-size: 0.9rem;
        }

        .control-group input:focus, .control-group select:focus, .control-group textarea:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
        }

        .control-group input[type="range"] {
          cursor: pointer;
        }

        .control-group input[type="color"] {
          height: 40px;
          cursor: pointer;
        }

        .preview-area {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          margin-bottom: 1.5rem;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .preview-trigger {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .preview-trigger:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        .preview-instructions {
          font-size: 0.9rem;
          opacity: 0.8;
          margin: 0;
        }

        .code-section {
          margin-top: 1.5rem;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .code-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .copy-button {  
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          padding: 6px 12px;
          cursor: pointer;
          color: inherit;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .copy-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .code-block {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.4;
          overflow-x: auto;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .code-block code {
          color: inherit;
        }

        @media (max-width: 768px) {
          .main-container {
            grid-template-columns: 1fr;
            padding: 1rem;
            gap: 1rem;
          }
          
          .header {
            padding: 1rem;
          }
          
          .header h1 {
            font-size: 1.4rem;
          }
          
          .preview-area {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TooltipsSandbox;