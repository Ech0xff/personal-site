"use client";

import "./AnimatedGridBackground.css";
import React from "react";

interface Props {
  smallGridSize?: number;
}

const AnimatedGridBackground = ({ smallGridSize = 30 }: Props) => {
  const largeGridSize = smallGridSize * 8;

  // 将计算后的数值转为 CSS 可用的字符串
  const gridStyles = {
    "--small-size": `${smallGridSize}px`,
    "--large-size": `${largeGridSize}px`,
    "--grid-offset": `${largeGridSize}px`,
  } as React.CSSProperties;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 动态网格层 */}
      <div
        className="absolute inset-0 animate-grid-scroll"
        style={{
          ...gridStyles,
          backgroundImage: `
            linear-gradient(to bottom, var(--grid-main) 2px, transparent 2px),
            linear-gradient(to right, var(--grid-main) 2px, transparent 2px),
            linear-gradient(to bottom, var(--grid-sub) 1px, transparent 1px),
            linear-gradient(to right, var(--grid-sub) 1px, transparent 1px)
          `,
          backgroundSize: `
            var(--large-size) var(--large-size), 
            var(--large-size) var(--large-size),
            var(--small-size) var(--small-size), 
            var(--small-size) var(--small-size)
          `,
        }}
      />
    </div>
  );
};

export default AnimatedGridBackground;
