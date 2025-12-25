export function getCommonPinningStyles({
    column,
}: {
    column: {
        id: string
        getIsPinned: () => "left" | "right" | false
        getStart: () => number
    }
}): React.CSSProperties {
    const isPinned = column.getIsPinned()

    return {
        left: isPinned === "left" ? `${column.getStart()}px` : undefined,
        right: isPinned === "right" ? `${column.getStart()}px` : undefined, // This might need adjustment based on implementation
        position: isPinned ? "sticky" : "relative",
        width: "auto", // column.getSize(),
        zIndex: isPinned ? 1 : 0,
    }
}
