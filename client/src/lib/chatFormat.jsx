export function formatChatText(text = "") {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  const renderInline = (line) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
  };

  const blocks = [];
  let currentItem = null;
  let plainList = null;

  lines.forEach((line) => {
    const numberedMatch = line.match(/^\d+\.\s+(.*)/);
    const bulletMatch = line.match(/^[*-]\s+(.*)/);

    if (numberedMatch) {
      currentItem = { type: "item", heading: numberedMatch[1], subpoints: [] };
      blocks.push(currentItem);
      plainList = null;
    } else if (bulletMatch) {
      if (currentItem) {
        currentItem.subpoints.push(bulletMatch[1]);
      } else {
        if (!plainList) {
          plainList = { type: "ul", items: [] };
          blocks.push(plainList);
        }
        plainList.items.push(bulletMatch[1]);
      }
    } else {
      currentItem = null;
      plainList = null;
      blocks.push({ type: "p", text: line });
    }
  });

  let itemCounter = 0;

  return blocks.map((block, i) => {
    if (block.type === "p") {
      return <p key={i}>{renderInline(block.text)}</p>;
    }
    if (block.type === "ul") {
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }
    itemCounter += 1;
    return (
      <div key={i} className="chat-exercise-item">
        <p className="chat-exercise-heading">
          <span className="chat-exercise-number">{itemCounter}.</span> {renderInline(block.heading)}
        </p>
        {block.subpoints.length > 0 && (
          <ul>
            {block.subpoints.map((sp, j) => (
              <li key={j}>{renderInline(sp)}</li>
            ))}
          </ul>
        )}
      </div>
    );
  });
}