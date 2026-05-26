"use client";

import { useState } from "react";

const roles = [
  {
    title: "Software engineer",
    text: "I build software products, client systems, and early-stage startup ideas with TypeScript, Next.js, React, Node.js, PostgreSQL, and Tailwind CSS. My work sits between product thinking, clean engineering, and getting real things launched.",
  },
  {
    title: "Freelancer",
    text: "I help teams ship practical software: SaaS MVPs, internal tools, workflow automations, integrations, and product improvements that need to move fast without becoming messy.",
  },
  {
    title: "Startup founder",
    text: "I like the earliest stages of an idea: shaping the product, building the first usable version, testing it with people, and learning whether it can become something real.",
  },
];

export function HeroRoleSwitcher() {
  const [activeRole, setActiveRole] = useState(0);

  return (
    <div className="w-full max-w-3xl self-center">
      <div className="hidden items-start gap-8 md:grid md:min-h-64 md:grid-cols-[0.75fr_1fr]">
        <div className="space-y-3 text-xl font-medium sm:text-2xl">
          {roles.map((role, index) => (
            <button
              className={`block text-left transition-colors ${
                activeRole === index
                  ? "text-white"
                  : "text-white/45 hover:text-white/70"
              }`}
              key={role.title}
              onClick={() => setActiveRole(index)}
              type="button"
            >
              {role.title}
            </button>
          ))}
        </div>

        <div className="min-h-64">
          <p
            className="role-copy max-w-md text-base leading-8 text-white/68"
            key={roles[activeRole].title}
          >
            {roles[activeRole].text}
          </p>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {roles.map((role, index) => {
          const isActive = activeRole === index;

          return (
            <div className="border-b border-white/12 pb-3" key={role.title}>
              <button
                aria-expanded={isActive}
                className={`flex w-full items-center justify-between gap-4 text-left text-xl font-medium transition-colors ${
                  isActive ? "text-white" : "text-white/48"
                }`}
                onClick={() => setActiveRole(index)}
                type="button"
              >
                <span>{role.title}</span>
                <span
                  className={`role-caret transition-transform duration-300 ${
                    isActive ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
                  isActive
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pt-4 text-base leading-8 text-white/65">
                    {role.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
