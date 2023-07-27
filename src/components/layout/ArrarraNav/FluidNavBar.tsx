import { useState, useRef, useEffect } from "preact/hooks";
import cx from "classnames";
import type { Colors } from "./colors";

const spacing = 4;
const closedCircleRadius = 60;

function calculateTouchingCoordinates(ev: TouchEvent) {
  return {
    x: window.innerWidth - ev.touches[0].clientX,
    y: window.innerHeight - ev.touches[0].clientY,
  };
}

function calculateMouseCoordinates(ev: MouseEvent) {
  return {
    x: window.innerWidth - ev.clientX,
    y: window.innerHeight - ev.clientY,
  };
}

function calculateHoveringIndex(touching: null | { x: number; y: number }, itemDeg: number) {
  if (touching) {
    let distance = Math.sqrt(touching.x * touching.x + touching.y * touching.y);
    if (distance > closedCircleRadius) {
      const touchRad = Math.atan(touching.y / touching.x);
      const touchDeg = (touchRad * 180) / Math.PI;
      if (touchDeg > 0) {
        return Math.floor(touchDeg / itemDeg);
      }
    }
  }

  return -1;
}

export default function FluidNavBar({
  items,
  initialActive,
  colors,
}: {
  items: [string, string][];
  initialActive: number;
  colors: Colors;
}) {
  const [touching, setIsTouching] = useState<null | { x: number; y: number }>(null);
  const [selected, setSelected] = useState(initialActive);
  const itemsContainer = useRef<HTMLDivElement>(null);
  const [maxItemWidth, setMaxItemWidth] = useState(0);
  const [itemsHeight, setItemsHeight] = useState(0);

  function handleTouchStart(ev: TouchEvent) {
    ev.preventDefault();
    setIsTouching(calculateTouchingCoordinates(ev));
  }

  function handleTouchMove(ev: TouchEvent) {
    setIsTouching(calculateTouchingCoordinates(ev));
  }

  function handleMouseMove(ev: MouseEvent) {
    setIsTouching(calculateMouseCoordinates(ev));
  }

  function handleTouchEnd() {
    // const lastTouching = calculateTouchingCoordinates(ev);
    const index = calculateHoveringIndex(touching, itemDeg);
    if (index !== -1 && selected !== index) {
      setSelected(index);

      setTimeout(() => {
        console.log(document.location);
        document.location.href = items[index][1];
      }, 100);
    }
    setIsTouching(null);
  }

  function handleMouseOut(ev: MouseEvent) {
    setIsTouching(null);
  }

  function handleMouseClick(ev: MouseEvent) {
    handleTouchEnd();
  }

  useEffect(() => {
    if (itemsContainer.current) {
      let maxWidth = 0;

      Array.from(itemsContainer.current.children).forEach((item, i) => {
        const { width, height } = item.getBoundingClientRect();
        if (width > maxWidth) {
          maxWidth = width;
        }
        if (i === 0) {
          setItemsHeight(height);
        }
      });
      setMaxItemWidth(maxWidth);
    }
  }, []);

  const quarterCircumference = (itemsHeight + spacing) * items.length;
  const radius = (quarterCircumference * 4) / Math.PI / 2;
  const openCircleRadius = radius + maxItemWidth + 16;
  const itemDeg = 90 / items.length;

  const hoveringIndex = calculateHoveringIndex(touching, itemDeg);

  return (
    <div
      class={cx("sm:invisible fixed h-full w-full z-30 pointer-events-none")}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onClick={handleMouseClick}
        style={{
          width: `${closedCircleRadius}px`,
          height: `${closedCircleRadius}px`,
          transform: touching ? `scale(${openCircleRadius / closedCircleRadius})` : null,
          backgroundColor: touching ? colors.dimmer(selected) : colors.base(selected),
          borderLeft: `solid 2px ${colors.darkerDimmer(selected)}`,
          borderTop: `solid 2px ${colors.darkerDimmer(selected)}`,
        }}
        class={cx(
          "pointer-events-auto absolute bottom-0 right-0 duration-500 rounded-tl-full  transition shadow-lg w-16 aspect-square transform-origin-br",
          { "delay-50": !touching }
        )}
      ></div>
      <div
        class={cx(
          "text-white transition-transform duration-500 h-8 w-8 absolute bottom-2 right-2 z-10",
          {
            "rotate-135": touching,
            "-rotate-45": !touching,
          }
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-full w-full"
          viewBox="0 0 448 512"
          fill="currentColor"
        >
          <path d="M246.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 109.3 361.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160zm160 352l-160-160c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L224 301.3 361.4 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3z" />
        </svg>
      </div>

      <div
        class={cx(
          "absolute bottom-0 right-0 w-full transition aspect-square text-white font-serif z-20"
        )}
        ref={itemsContainer}
      >
        {items.map(([title, href], i) => {
          const deg = i * (90 / items.length) + 90 / items.length / 4;
          const rad = deg * (Math.PI / 180);
          const isSelected = i === selected;

          const bottom = Math.sin(rad) * (radius + (touching ? 0 : -50));
          const right = Math.cos(rad) * (radius + (touching ? 0 : -50));

          const transformStyle = `translateX(-${right}px) translateY(-${bottom}px) rotate(${deg}deg)`;

          return (
            <a
              href={href}
              key={i}
              class={cx("transform-origin-r absolute right-0 bottom-0 px-2 py-1 rounded-md", {
                "duration-500 opacity-100": touching,
                "delay-200": touching && !isSelected,
                "delay-0": touching && isSelected,
                "duration-300": !touching,
                "opacity-0": !touching,
                "outline-2 outline-solid": hoveringIndex === i,
              })}
              onTouchStart={(ev) => (isSelected ? ev.stopPropagation() : null)}
              style={{
                transitionProperty: "transform, opacity",
                backgroundColor: hoveringIndex === i || isSelected ? colors.base(i) : "",
                transform: transformStyle,
                outlineColor: colors.darker(i),
              }}
            >
              {title}
            </a>
          );
        })}
      </div>
    </div>
  );
}
