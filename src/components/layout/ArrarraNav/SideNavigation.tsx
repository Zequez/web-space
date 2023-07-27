import cx from "classnames";
import { useEffect, useState, useMemo } from "preact/hooks";
import genColors from "./colors";
import FluidNavBar from "./FluidNavBar";

SideNavigation.contentPaddingClass = "pt-12 pr-0 sm-(pr-56 pt-0)";

export default function SideNavigation({
  items,
  initialActive,
  avatar,
  avatarDescription,
  title,
}: {
  items: [string, string][];
  initialActive: number;
  avatar: string;
  avatarDescription: string;
  title: string;
}) {
  const colors = useMemo(() => genColors(items.length), [items.length]);

  const activeItem = items[initialActive];

  return (
    <>
      <header class="fixed h-12 top-0 inset-x-0 bg-gray-100 border-b border-gray-200 z-20 sm:hidden flex items-center">
        <a class="flex items-center flex-grow" href="/">
          <div class="h-12 w-12 mr-4 flex-shrink-0">
            <img src={avatar} alt={avatarDescription} />
          </div>
          <h1 class="text-base xs:text-lg font-serif text-black/70 text-shadow-light-sm flex-grow  leading-[1.25rem]">
            {title}
          </h1>
        </a>
        {activeItem ? (
          <>
            <a
              href={activeItem[1]}
              class="mx-1 text-sm xs:text-base text-white text-shadow-dark-sm/40 px-2 py-1 rounded-l-md font-serif whitespace-nowrap"
              style={{
                background: `linear-gradient(to bottom, ${colors.slightlyDarker(
                  initialActive
                )}, ${colors.base(initialActive)})`,
                boxShadow: "inset 0 1px 4px #0002, 0 1px 0 #fff, 0 -1px 0 #0007",
              }}
            >
              {activeItem[0]}
            </a>
            {/* <div
              class="absolute right-0 top-[50%] h-1 w-2 translate-y-[-50%]"
              style={{
                background: colors.base(initialActive),
                boxShadow: "inset 0 1px 4px #0002, 0 1px 0 #fff, 0 -1px 0 #0007",
              }}
            ></div> */}
          </>
        ) : null}
      </header>
      {initialActive !== -1 ? (
        <div
          class="fixed right-0 top-0 border-l-1 border-solid w-1 h-screen z-30"
          style={{
            background: colors.base(initialActive),
            borderColor: colors.darker(initialActive),
          }}
        ></div>
      ) : null}
      <header class="fixed w-56 inset-y-0 right-0 bg-gray-100 z-20 border-l border-gray-300 hidden sm:block">
        <a class="block" href="/">
          <div class="p-4">
            <img
              src={avatar}
              alt={avatarDescription}
              class="rounded-full border-2 border-gray-300"
            />
          </div>

          <h1 class="text-2xl font-serif text-center mb-4 text-black/70 text-shadow-light-sm">
            {title}
          </h1>
        </a>
        <div class="text-white font-serif text-center">
          {items.map(([title, href], i) => (
            <div>
              <a
                href={href}
                class={cx("inline-block rounded-md px-2 py-1 mb-2 outline-2 hover:outline-solid", {
                  "text-shadow-dark-sm/30": i == initialActive,
                })}
                style={{
                  color: i == initialActive ? "white" : colors.base(i),
                  backgroundColor: i === initialActive ? colors.base(i) : colors.transparent(i),
                  outlineColor: i == initialActive ? colors.darker(i) : colors.base(i),
                }}
              >
                {title}
              </a>
            </div>
          ))}
        </div>
      </header>
      <FluidNavBar items={items} initialActive={initialActive} colors={colors} />
    </>
  );
}
