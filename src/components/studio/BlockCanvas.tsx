import React from 'react';

export interface BlockDefinition {
  id: string;
  title?: string;
  eyeCue?: string;
  whyHere?: string;
  render: () => React.ReactNode;
}

export function BlockCanvas({
  blocks,
}: {
  screenId?: string;
  blocks: BlockDefinition[];
}) {
  return (
    <div className="flex flex-col" style={{ gap: 'var(--ds-block-gap)' }}>
      {blocks.map((block) => (
        <div key={block.id} data-block-id={block.id}>
          {block.render()}
        </div>
      ))}
    </div>
  );
}
