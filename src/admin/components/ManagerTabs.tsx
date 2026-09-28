import { useState, type ReactNode } from "react";
import Crud from "@/admin/components/Crud";

// Tab shell shared by the grouped admin pages.
//
// A tab is either a Crud table or an existing manager component. The custom
// managers (hero, news, notices, events, quick links) are whole pages with
// their own upload or publish UI, so they are rendered as-is inside a tab
// rather than reimplemented as a Crud config.

export type ManagerTab = {
  key: string;
  label: string;
  /** Rendered when set; otherwise the tab is a Crud table. */
  component?: ReactNode;
  entity?: string;
  title?: string;
  subtitle?: string;
  fields?: any[];
  columns?: any[];
  defaultValues?: any;
};

export default function ManagerTabs({
  title,
  description,
  tabs,
}: {
  title: string;
  description: string;
  tabs: ManagerTab[];
}) {
  const [active, setActive] = useState(tabs[0].key);
  const tab = tabs.find((t) => t.key === active) || tabs[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#0B2545]">{title}</h1>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            aria-current={active === t.key ? "page" : undefined}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
              active === t.key
                ? "bg-[#0B2545] text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-[#0D9488] hover:text-[#0D9488]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab.component ? (
        <div className="-mt-4">{tab.component}</div>
      ) : (
        <Crud
          key={tab.key}
          entity={tab.entity as string}
          title={tab.title as string}
          subtitle={tab.subtitle}
          fields={tab.fields as any[]}
          columns={tab.columns as any[]}
          defaultValues={tab.defaultValues}
        />
      )}
    </div>
  );
}
