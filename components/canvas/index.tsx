import { useCanvas } from "@/context/canvas-context";
import CanvasLoader from "./canvas-loader";
import { cn } from "@/lib/utils";
import CanvasFloatingToolbar from "./canvas-floating-toolbar";
import { useState } from "react";
import { TOOL_MODE_ENUM, ToolModeType } from "@/constant/canvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CanvasControls from "./canvas-control";

const Canvas = ({
  projectId,
  projectName,
  isPending,
}: {
  projectId: string;
  projectName: string | null;
  isPending: boolean;
}) => {
  const { theme, frames, selectedFrame, setSelectedFrameId, loadingStatus } =
    useCanvas();

  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercent, setZoomPercent] = useState<number>(53);
  const [currentScale, setCurrentScale] = useState<number>(0.53);

  const currentStatus = isPending
    ? "fetching"
    : loadingStatus !== "idle" && loadingStatus !== "completed"
      ? loadingStatus
      : null;

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        <CanvasFloatingToolbar projectId={projectId} />

        {currentStatus && <CanvasLoader status={currentStatus} />}

        <TransformWrapper
          initialScale={0.53}
          initialPositionX={40}
          initialPositionY={5}
          minScale={0.1}
          maxScale={3}
          wheel={{ step: 0.1 }}
          pinch={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          centerZoomedOut={false}
          centerOnInit={false}
          smooth={true}
          limitToBounds={false}
          panning={{
            disabled: toolMode !== TOOL_MODE_ENUM.HAND,
          }}
          onTransformed={(ref) => {
            setZoomPercent(Math.round(ref.state.scale * 100));
            setCurrentScale(ref.state.scale);
          }}
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <div
                className={cn(
                  `absolute inset-0 w-full h-full bg-[#eee] dark:bg-[#242423] p-3`,
                  toolMode === TOOL_MODE_ENUM.HAND
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default",
                )}
                style={{
                  backgroundImage:
                    "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    overflow: "unset",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    background: "red",
                  }}
                >
                  <div className="size-50 bg-blue-500">Box</div>
                </TransformComponent>
              </div>

              <CanvasControls
                zoomIn={zoomIn}
                zoomOut={zoomOut}
                zoomPercent={zoomPercent}
                toolMode={toolMode}
                setToolMode={setToolMode}
              />
            </>
          )}
        </TransformWrapper>
      </div>
    </>
  );
};

export default Canvas;
