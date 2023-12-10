import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Html5QrcodeResult } from "html5-qrcode/esm/core";
import useCanvasCamera from "@hooks/useCanvasCamera";
import { twMerge } from "tailwind-merge";

import { createRoundedRectPath, roundedRect } from "@shared/utils/canvas";
import { triggerHapticFeedback, HAPTIC_SUCCESS } from "@shared/utils/haptic";
import {
    extractThemeColorsFromDOM,
    extractThemeUtilitiesFromDOM,
    remToPx,
} from "@shared/utils/theme";

interface CodeScannerProps {
    cameraId: string;
    onQRCodeScan: (result: Html5QrcodeResult) => void;
    showFilter: boolean;
    fps: number;
    debug: boolean;
}

enum ScanStatus {
    Scanning,
    Succuss,
    Fail,
}

const CAPTURE_AREA_RATIO = 0.5;

export default function CodeScanner({
    cameraId,
    onQRCodeScan,
    showFilter,
    fps,
    debug,
}: CodeScannerProps) {
    const [containerId] = useState(crypto.randomUUID());
    const [screenAspectRatio, setScreenAspectRatio] = useState<number>(
        window.innerWidth / window.innerHeight
    );
    const [scanStatus, setScanStatus] = useState<ScanStatus | null>(null);

    const { videoRef, canvasRef } = useCanvasCamera({
        cameraId,
        // idealWidth: undefined,
        // idealHeight: 1920,
        aspectRatio: screenAspectRatio,
        beforeDraw(ctx, frameNumber) {
            let boxLen = Math.min(ctx.canvas.width, ctx.canvas.height) * CAPTURE_AREA_RATIO;
            let crossLen = boxLen * 0.5;
            const radius = remToPx(extractThemeUtilitiesFromDOM().roundedBox) ?? 0;

            // Create overlay frame
            ctx.save();
            if (scanStatus === ScanStatus.Scanning) {
                ctx.strokeStyle = extractThemeColorsFromDOM().primary;

                // Pulsing animation
                boxLen *= (Math.sin(frameNumber / 30 + (3 * Math.PI) / 2) + 1) / 50 + 1;
                crossLen = boxLen * 0.5;
            } else if (scanStatus === ScanStatus.Succuss) {
                ctx.strokeStyle = extractThemeColorsFromDOM().success;
            } else if (scanStatus === ScanStatus.Fail) {
                ctx.strokeStyle = extractThemeColorsFromDOM().error;
            } else {
                ctx.strokeStyle = extractThemeColorsFromDOM().neutralContent;
            }
            ctx.lineWidth = boxLen * 0.03;
            roundedRect(
                ctx,
                (ctx.canvas.width - boxLen) / 2,
                (ctx.canvas.height - boxLen) / 2,
                boxLen,
                boxLen,
                radius
            );
            ctx.clearRect(0, (ctx.canvas.height - crossLen) / 2, ctx.canvas.width, crossLen);
            ctx.clearRect((ctx.canvas.width - crossLen) / 2, 0, crossLen, ctx.canvas.height);
            ctx.restore();

            // Create bg overlay
            ctx.save();
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.beginPath();
            createRoundedRectPath(
                ctx,
                (ctx.canvas.width - boxLen) / 2,
                (ctx.canvas.height - boxLen) / 2,
                boxLen,
                boxLen,
                radius
            );
            ctx.clip();
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();

            // Ensure camera stream draws below overlay
            ctx.globalCompositeOperation = "destination-atop";
        },
        afterDraw(ctx) {
            // Revert composition mode
            ctx.globalCompositeOperation = "source-over";
        },
    });

    useEffect(() => {
        const handleScreenResize = () => {
            setScreenAspectRatio(window.innerWidth / window.innerHeight);
        };

        window.addEventListener("resize", handleScreenResize);

        return () => {
            window.removeEventListener("resize", handleScreenResize);
        };
    }, []);

    useEffect(() => {
        let scanInterval: NodeJS.Timeout;

        const handleQRCodeScan = (result: Html5QrcodeResult) => {
            setScanStatus(ScanStatus.Succuss);
            onQRCodeScan(result);
        };

        const handleQRCodeFail = () => {
            if (ScanStatus.Scanning) setScanStatus(ScanStatus.Fail);
        };

        const init = async () => {
            const html5Qrcode = new Html5Qrcode(containerId, false);

            const scanForQR = () => {
                // Only run if in scanning mode
                if (scanStatus !== ScanStatus.Scanning) return;

                const canvas = canvasRef.current;
                if (!canvas) return;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const captureLen = Math.min(canvas.width, canvas.height) * CAPTURE_AREA_RATIO;
                const imageData = ctx.getImageData(
                    (canvas.width - captureLen) / 2,
                    (canvas.height - captureLen) / 2,
                    captureLen,
                    captureLen
                );

                const tmpCanvas = document.createElement("canvas");
                tmpCanvas.width = captureLen;
                tmpCanvas.height = captureLen;
                const tmpCtx = tmpCanvas.getContext("2d");
                if (!tmpCtx) return;

                // Put the pixel data onto the temporary canvas
                tmpCtx.putImageData(imageData, 0, 0);

                tmpCanvas.toBlob(async (blob) => {
                    if (!blob) return;
                    try {
                        const result = await html5Qrcode.scanFileV2(
                            new File([blob], "canvasSnapshot")
                        );
                        handleQRCodeScan(result);
                        triggerHapticFeedback(HAPTIC_SUCCESS);
                    } catch (error) {
                        handleQRCodeFail();
                    }
                });
            };

            scanInterval = setInterval(scanForQR, (1 / fps) * 1000);
        };

        init();

        return () => {
            clearInterval(scanInterval);
        };
    }, [canvasRef, containerId, fps, onQRCodeScan, scanStatus]);

    const handleMouseDown = () => {
        setScanStatus(ScanStatus.Scanning);
        triggerHapticFeedback(HAPTIC_SUCCESS);
    };

    const handleMouseUp = () => {
        if (scanStatus === ScanStatus.Scanning) setScanStatus(null);
    };

    return (
        <div className="h-full">
            <div
                className="relative h-full touch-none"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
            >
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className={twMerge(
                        "absolute h-full w-full object-cover",
                        debug && "relative h-1/2 object-contain",
                        !debug && showFilter ? "invisible" : "visible"
                    )}
                />
                <canvas
                    ref={canvasRef}
                    className={twMerge(
                        "absolute h-full w-full object-cover",
                        debug && "relative h-1/2 object-contain",
                        debug || showFilter ? "visible" : "invisible"
                    )}
                />
            </div>

            {/* Scanner Element  */}
            <div id={containerId} hidden />
        </div>
    );
}

CodeScanner.defaultProps = {
    showFilter: false,
    fps: 10,
    debug: false,
};
