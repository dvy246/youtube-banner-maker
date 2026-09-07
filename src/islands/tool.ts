/**
 * YouTubeBannerMaker.com — Client Island
 * Architecture Layer L3: The ONLY client-side JavaScript module.
 * Strictly adheres to §C.4 DOM contract, §C.5 responsibilities, §D state machine, and §E interactions.
 */

import {
  CANVAS,
  DEVICES,
  SAFE_PX,
  MAX_UPLOAD_BYTES,
  type DeviceKey,
} from '../lib/spec';
import {
  type Scene,
  type Background,
  type TextLayer,
  type ShapeLayer,
  type PhotoFrameLayer,
  type BadgeLayer,
  type SocialPlatform,
  SCENE_KEY,
  defaultScene,
  serializeScene,
  deserializeScene,
  cloneScene,
} from '../lib/scene';
import {
  renderScene,
  renderPreview,
  renderDeviceCrop,
  renderExport,
  clampZoom,
  clampOffset,
  measureTextWidth,
  fitTextToSafeArea,
  type ImageMap,
} from '../lib/render';
import { validateScene, estimateTextBounds } from '../lib/validate';
import { exportBanner, exportAvatar } from '../lib/export';
import { simulateReencode } from '../lib/simulate';
import {
  type TemplateManifest,
  getTemplate,
  templateToScene,
} from '../lib/template';
import { TEMPLATES } from '../data/templates';
import {
  trackEvent,
  cleanImageFormat,
  getSizeTier,
} from '../lib/analytics';
import { computeVariation, applyDesignSystemToScene, type VariationType } from '../lib/variations';

// Client i18n lookup from embedded payload
function getClientI18n(): any {
  try {
    const el = document.getElementById('tool-i18n');
    return el && el.textContent ? JSON.parse(el.textContent) : {};
  } catch {
    return {};
  }
}
const clientI18n = getClientI18n();

// App state phase per §D.1
type AppPhase = 'BOOT' | 'EMPTY' | 'NEEDS_SOURCE' | 'READY' | 'ERROR';

class ToolIsland {
  private mode: 'make' | 'fix' | 'check' = 'fix';
  private phase: AppPhase = 'BOOT';
  private scene: Scene;
  private images: ImageMap = new Map();
  private activeDevice: DeviceKey = 'mobile'; // Default mobile per §D.6
  private currentImageElement: HTMLImageElement | null = null;
  private sourceDimensions: { w: number; h: number } = { w: CANVAS.width, h: CANVAS.height };
  private sourceFileSize = 0;
  private hasExported = false;
  private exportAnywayAcknowledged = false;
  private handoffFixBtn: HTMLButtonElement | null = null;
  private sourceDataUrl: string | null = null;
  private isNonSrgb = false;

  // Create Door (mode === 'make') state
  private currentTemplateId: string | null = null;
  private currentTemplateManifest: TemplateManifest | null = null;
  private draggingTextLayerId: string | null = null;
  private pointerDragStartFracX = 0;
  private pointerDragStartFracY = 0;
  private layerDragStartPosX = 0;
  private layerDragStartPosY = 0;

  // Create Door DOM hooks
  private templatePickerModalEl: HTMLElement | null = null;
  private changeTemplateBtn: HTMLButtonElement | null = null;
  private closeTemplateModalBtn: HTMLButtonElement | null = null;
  private startBlankBtn: HTMLButtonElement | null = null;
  private handoffCheckBtn: HTMLButtonElement | null = null;
  private textLayersContainerEl: HTMLElement | null = null;
  private currentTemplateNameEl: HTMLElement | null = null;
  private currentTemplateNicheEl: HTMLElement | null = null;

  // Background Swap DOM hooks
  private bgTypeGradientBtn: HTMLButtonElement | null = null;
  private bgTypeSolidBtn: HTMLButtonElement | null = null;
  private bgTypePhotoBtn: HTMLButtonElement | null = null;
  private bgGradientControlsEl: HTMLElement | null = null;
  private bgSolidControlsEl: HTMLElement | null = null;
  private bgPhotoControlsEl: HTMLElement | null = null;
  private bgGradientFromInput: HTMLInputElement | null = null;
  private bgGradientToInput: HTMLInputElement | null = null;
  private bgGradientAngleInput: HTMLInputElement | null = null;
  private bgGradientAngleValEl: HTMLElement | null = null;
  private bgGradientFromHexEl: HTMLElement | null = null;
  private bgGradientToHexEl: HTMLElement | null = null;
  private bgSolidColorInput: HTMLInputElement | null = null;
  private bgSolidColorHexEl: HTMLElement | null = null;
  private bgPhotoUploadBtn: HTMLButtonElement | null = null;
  private bgPhotoFileInput: HTMLInputElement | null = null;
  private makePhotoRepositionWrap: HTMLElement | null = null;

  // Photo Frame DOM hooks
  private frameStatusBadgeEl: HTMLElement | null = null;
  private frameFileInputEl: HTMLInputElement | null = null;
  private frameControlsActiveEl: HTMLElement | null = null;
  private frameControlsInactiveEl: HTMLElement | null = null;
  private frameUploadBtn: HTMLButtonElement | null = null;
  private frameUploadBtnLabel: HTMLElement | null = null;
  private frameShapeCircleBtn: HTMLButtonElement | null = null;
  private frameShapeRectBtn: HTMLButtonElement | null = null;
  private frameZoomSlider: HTMLInputElement | null = null;
  private frameZoomValEl: HTMLElement | null = null;
  private frameBorderColorInput: HTMLInputElement | null = null;
  private frameBorderColorHexEl: HTMLElement | null = null;
  private frameBorderWidthInput: HTMLInputElement | null = null;
  private frameBorderWidthValEl: HTMLElement | null = null;
  private framePosLeftBtn: HTMLButtonElement | null = null;
  private framePosCenterBtn: HTMLButtonElement | null = null;
  private framePosRightBtn: HTMLButtonElement | null = null;
  private frameRemovePhotoBtn: HTMLButtonElement | null = null;
  private frameRemoveLayerBtn: HTMLButtonElement | null = null;
  private frameAddBtn: HTMLButtonElement | null = null;

  // Frame Dragging State
  private draggingFrameLayerId: string | null = null;
  private frameDragStartPosX = 0;
  private frameDragStartPosY = 0;
  private hasDraggedFrame = false;

  // Accent Shapes DOM hooks
  private shapeStatusBadgeEl: HTMLElement | null = null;
  private shapeAddRuleBtn: HTMLButtonElement | null = null;
  private shapeAddCardBtn: HTMLButtonElement | null = null;
  private shapeAddBadgeBtn: HTMLButtonElement | null = null;
  private shapeActiveControlsEl: HTMLElement | null = null;
  private shapeColorInput: HTMLInputElement | null = null;
  private shapeColorHexEl: HTMLElement | null = null;
  private shapeOpacitySlider: HTMLInputElement | null = null;
  private shapeOpacityValEl: HTMLElement | null = null;
  private shapeLayerLabelEl: HTMLElement | null = null;
  private shapeRemoveBtn: HTMLButtonElement | null = null;

  // Motion Studio State
  private motionCanvasEl: HTMLCanvasElement | null = null;
  private motionCtx: CanvasRenderingContext2D | null = null;
  private motionToggleEl: HTMLInputElement | null = null;
  private motionSpeedSlider: HTMLInputElement | null = null;
  private motionSpeedValEl: HTMLElement | null = null;
  private motionIntensitySlider: HTMLInputElement | null = null;
  private motionIntensityValEl: HTMLElement | null = null;
  private motionRecordVideoBtn: HTMLButtonElement | null = null;
  private motionCopyObsBtn: HTMLButtonElement | null = null;
  private motionCopyCssBtn: HTMLButtonElement | null = null;
  private activeMotionPreset: string = 'neon-pulse';
  private isMotionRunning = false;
  private motionSpeed = 1.0;
  private motionIntensity = 0.75;
  private motionTime = 0;
  private motionAnimFrameId: number | null = null;
  private motionParticles: Array<{ x: number; y: number; r: number; vx: number; vy: number; alpha: number; pulse: number }> = [];
  private isRecordingVideo = false;

  // Background Style Presets
  private readonly BG_STYLE_PRESETS: Record<string, Background> = {
    crimson: { type: 'gradient', from: '#8B1E2D', to: '#E63946', stops: ['#8B1E2D', '#B3261E', '#E63946'], angle: 135 },
    pearl: { type: 'gradient', from: '#FFFAF3', to: '#FFF2DB', stops: ['#FFFAF3', '#FFF2DB', '#FFE5BF'], angle: 135 },
    noir_rose: { type: 'gradient', from: '#000000', to: '#1A080E', stops: ['#000000', '#1A080E', '#26161F'], angle: 135 },
    carbon: { type: 'gradient', from: '#0C0D0E', to: '#1F2124', angle: 135 },
    noir: { type: 'gradient', from: '#090A0B', to: '#15171A', angle: 180 },
    indigo: { type: 'gradient', from: '#0B0E23', to: '#1B1F4A', angle: 135 },
    nordic: { type: 'gradient', from: '#17191C', to: '#22262B', angle: 135 },
    sunset: { type: 'gradient', from: '#2A1310', to: '#180B1C', angle: 135 },
    emerald: { type: 'gradient', from: '#061510', to: '#0E2920', angle: 135 },
    charcoal: { type: 'solid', color: '#121316' },
    clean: { type: 'gradient', from: '#F7F8F9', to: '#E4E7EB', angle: 180 },
  };

  // DOM hook references per §C.4
  private editorEl!: HTMLElement;
  private canvasEl!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private dropzoneEl!: HTMLElement;
  private uploadInputEl!: HTMLInputElement;
  private restoreNoticeEl!: HTMLElement;
  private browseBtn!: HTMLButtonElement;
  private reuploadBtn!: HTMLButtonElement;
  private dragOverlayEl!: HTMLElement;

  // Undo / Redo & Shortcuts & Clipboard & Toast
  private undoStack: Scene[] = [];
  private redoStack: Scene[] = [];
  private readonly MAX_UNDO = 40;
  private btnUndoEl: HTMLButtonElement | null = null;
  private btnRedoEl: HTMLButtonElement | null = null;
  private btnShortcutsEl: HTMLButtonElement | null = null;
  private shortcutsModalEl: HTMLElement | null = null;
  private closeShortcutsModalBtn: HTMLButtonElement | null = null;
  private toolToastEl: HTMLElement | null = null;
  private toolToastTextEl: HTMLElement | null = null;
  private toastTimer: number | null = null;
  private copyClipboardBtn: HTMLButtonElement | null = null;

  // Tabs & Previews
  private deviceTabsContainer!: HTMLElement;
  private deviceTabButtons: Map<DeviceKey, HTMLButtonElement> = new Map();
  private previewCanvases: Map<DeviceKey, HTMLCanvasElement> = new Map();

  // Photo controls
  private zoomSlider!: HTMLInputElement;
  private zoomClampBadge!: HTMLElement;
  private zoomWarningEl!: HTMLElement;
  private zoomInBtn!: HTMLButtonElement;
  private zoomOutBtn!: HTMLButtonElement;
  private panUpBtn!: HTMLButtonElement;
  private panDownBtn!: HTMLButtonElement;
  private panLeftBtn!: HTMLButtonElement;
  private panRightBtn!: HTMLButtonElement;
  private panCenterBtn!: HTMLButtonElement;
  private panResetBtn!: HTMLButtonElement;
  private extendToggle!: HTMLInputElement;

  // Simulation
  private simulateToggle!: HTMLInputElement;
  private simulatePanel!: HTMLElement;
  private simulateCanvas!: HTMLCanvasElement;
  private simulateStats!: HTMLElement;

  // Export
  private exportFormatSelect!: HTMLSelectElement;
  private exportButton!: HTMLButtonElement;
  private exportButtonText!: HTMLElement;
  private exportThumbnailBtn: HTMLButtonElement | null = null;
  private exportAvatarBtn: HTMLButtonElement | null = null;
  private exportMeta!: HTMLElement;
  private exportNote!: HTMLElement;

  // Diagnostics
  private verdictAllClearEl!: HTMLElement;
  private verdictEmptyEl!: HTMLElement;
  private verdictsContainerEl!: HTMLElement;
  private verdictCountBadge!: HTMLElement;
  private verdictsRegionEl!: HTMLElement;

  // Overlay guides
  private safeZoneBox!: HTMLElement;
  private desktopGuideTop!: HTMLElement;
  private desktopGuideBottom!: HTMLElement;
  private desktopGuideBand!: HTMLElement;
  private tabletGuideBox!: HTMLElement;
  private tvGuideBox!: HTMLElement;

  // Funnel & scheduling per D-8
  private frameScheduled = false;
  private persistTimer: number | null = null;
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private initialOffsetX = 0;
  private initialOffsetY = 0;

  // Multi-touch gestures tracking
  private activePointers = new Map<number, { x: number; y: number }>();
  private initialPinchDist = 0;
  private initialPinchZoom = 1;

  constructor() {
    this.scene = defaultScene();
  }

  public init(): void {
    const root = document.getElementById('tool-root');
    if (!root) return;
    this.mode = (root.getAttribute('data-mode') as 'make' | 'fix' | 'check') || 'fix';
    trackEvent('editor_start', { mode: this.mode });

    this.resolveDomHooks();
    this.restoreSessionOrPreset();
    this.wireEvents();

    if (this.phase === 'READY') {
      this.scheduleFrame();
    } else {
      this.updatePhaseUI();
    }
  }

  public getCurrentTemplateId(): string | null {
    return this.currentTemplateId;
  }

  /**
   * Asserts and resolves DOM contracts (§C.4)
   */
  private resolveDomHooks(): void {
    this.editorEl = document.getElementById('editor') as HTMLElement;
    this.canvasEl = document.getElementById('editor-canvas') as HTMLCanvasElement;
    if (this.canvasEl) {
      this.ctx = this.canvasEl.getContext('2d')!;
    }
    this.dropzoneEl = document.getElementById('dropzone') as HTMLElement;
    this.uploadInputEl = document.getElementById('upload-input') as HTMLInputElement;
    this.restoreNoticeEl = document.getElementById('restore-notice') as HTMLElement;
    this.browseBtn = document.getElementById('browse-btn') as HTMLButtonElement;
    this.reuploadBtn = document.getElementById('reupload-btn') as HTMLButtonElement;
    this.dragOverlayEl = document.getElementById('drag-active-overlay') as HTMLElement;

    // Tabs
    this.deviceTabsContainer = document.getElementById('device-tabs') as HTMLElement;
    const tabButtons = this.deviceTabsContainer?.querySelectorAll<HTMLButtonElement>('button[data-device]');
    tabButtons?.forEach((btn) => {
      const dev = btn.getAttribute('data-device') as DeviceKey;
      if (dev) this.deviceTabButtons.set(dev, btn);
    });

    // Preview grid
    const previews = document.querySelectorAll<HTMLCanvasElement>('#preview-grid canvas[data-preview]');
    previews.forEach((p) => {
      const dev = p.getAttribute('data-preview') as DeviceKey;
      if (dev) this.previewCanvases.set(dev, p);
    });

    // Reposition
    this.zoomSlider = document.getElementById('zoom-slider') as HTMLInputElement;
    this.zoomClampBadge = document.getElementById('zoom-clamp-badge') as HTMLElement;
    this.zoomWarningEl = document.getElementById('zoom-warning') as HTMLElement;
    this.zoomInBtn = document.getElementById('zoom-in-btn') as HTMLButtonElement;
    this.zoomOutBtn = document.getElementById('zoom-out-btn') as HTMLButtonElement;
    this.panUpBtn = document.getElementById('pan-up') as HTMLButtonElement;
    this.panDownBtn = document.getElementById('pan-down') as HTMLButtonElement;
    this.panLeftBtn = document.getElementById('pan-left') as HTMLButtonElement;
    this.panRightBtn = document.getElementById('pan-right') as HTMLButtonElement;
    this.panCenterBtn = document.getElementById('pan-center') as HTMLButtonElement;
    this.panResetBtn = document.getElementById('pan-reset') as HTMLButtonElement;
    this.extendToggle = document.getElementById('extend-toggle') as HTMLInputElement;

    // Simulation
    this.simulateToggle = document.getElementById('simulate-toggle') as HTMLInputElement;
    this.simulatePanel = document.getElementById('simulate-panel') as HTMLElement;
    this.simulateCanvas = document.getElementById('simulate-canvas') as HTMLCanvasElement;
    this.simulateStats = document.getElementById('simulate-stats') as HTMLElement;

    // Export
    this.exportFormatSelect = document.getElementById('export-format') as HTMLSelectElement;
    this.exportButton = document.getElementById('export-button') as HTMLButtonElement;
    this.exportButtonText = document.getElementById('export-button-text') as HTMLElement;
    this.exportThumbnailBtn = document.getElementById('export-thumbnail-button') as HTMLButtonElement | null;
    this.exportAvatarBtn = document.getElementById('export-avatar-button') as HTMLButtonElement | null;
    this.exportMeta = document.getElementById('export-meta') as HTMLElement;
    this.exportNote = document.getElementById('export-note') as HTMLElement;

    // Diagnostics
    this.verdictsRegionEl = document.getElementById('verdicts') as HTMLElement;
    this.verdictAllClearEl = document.getElementById('verdict-all-clear') as HTMLElement;
    this.verdictEmptyEl = document.getElementById('verdict-empty') as HTMLElement;
    this.verdictsContainerEl = document.getElementById('verdicts-container') as HTMLElement;
    this.verdictCountBadge = document.getElementById('verdict-count') as HTMLElement;

    // Guides
    this.safeZoneBox = document.getElementById('safe-zone-box') as HTMLElement;
    this.desktopGuideTop = document.getElementById('desktop-guide-top') as HTMLElement;
    this.desktopGuideBottom = document.getElementById('desktop-guide-bottom') as HTMLElement;
    this.desktopGuideBand = document.getElementById('desktop-guide-band') as HTMLElement;
    this.tabletGuideBox = document.getElementById('tablet-guide-box') as HTMLElement;
    this.tvGuideBox = document.getElementById('tv-guide-box') as HTMLElement;
    this.handoffFixBtn = document.getElementById('handoff-fix-btn') as HTMLButtonElement;

    // Create Door (mode === 'make') hooks
    this.templatePickerModalEl = document.getElementById('template-picker-modal');
    this.changeTemplateBtn = document.getElementById('change-template-btn') as HTMLButtonElement | null;
    this.closeTemplateModalBtn = document.getElementById('close-template-modal-btn') as HTMLButtonElement | null;
    this.startBlankBtn = document.getElementById('start-blank-btn') as HTMLButtonElement | null;
    this.handoffCheckBtn = document.getElementById('handoff-check-btn') as HTMLButtonElement | null;
    this.textLayersContainerEl = document.getElementById('text-layers-container');
    this.currentTemplateNameEl = document.getElementById('current-template-name');
    this.currentTemplateNicheEl = document.getElementById('current-template-niche');

    this.bgTypeGradientBtn = document.getElementById('bg-type-gradient') as HTMLButtonElement | null;
    this.bgTypeSolidBtn = document.getElementById('bg-type-solid') as HTMLButtonElement | null;
    this.bgTypePhotoBtn = document.getElementById('bg-type-photo') as HTMLButtonElement | null;
    this.bgGradientControlsEl = document.getElementById('bg-gradient-controls');
    this.bgSolidControlsEl = document.getElementById('bg-solid-controls');
    this.bgPhotoControlsEl = document.getElementById('bg-photo-controls');
    this.bgGradientFromInput = document.getElementById('bg-gradient-from') as HTMLInputElement | null;
    this.bgGradientToInput = document.getElementById('bg-gradient-to') as HTMLInputElement | null;
    this.bgGradientAngleInput = document.getElementById('bg-gradient-angle') as HTMLInputElement | null;
    this.bgGradientAngleValEl = document.getElementById('bg-gradient-angle-val');
    this.bgGradientFromHexEl = document.getElementById('bg-gradient-from-hex');
    this.bgGradientToHexEl = document.getElementById('bg-gradient-to-hex');
    this.bgSolidColorInput = document.getElementById('bg-solid-color') as HTMLInputElement | null;
    this.bgSolidColorHexEl = document.getElementById('bg-solid-color-hex');
    this.bgPhotoUploadBtn = document.getElementById('bg-photo-upload') as HTMLButtonElement | null;
    this.bgPhotoFileInput = document.getElementById('bg-photo-file-input') as HTMLInputElement | null;
    this.makePhotoRepositionWrap = document.getElementById('make-photo-reposition-wrap');

    // Photo Frame hooks
    this.frameStatusBadgeEl = document.getElementById('frame-status-badge');
    this.frameFileInputEl = document.getElementById('frame-photo-file-input') as HTMLInputElement | null;
    this.frameControlsActiveEl = document.getElementById('frame-controls-active');
    this.frameControlsInactiveEl = document.getElementById('frame-controls-inactive');
    this.frameUploadBtn = document.getElementById('frame-photo-upload-btn') as HTMLButtonElement | null;
    this.frameUploadBtnLabel = document.getElementById('frame-upload-btn-label');
    this.frameShapeCircleBtn = document.getElementById('frame-shape-circle-btn') as HTMLButtonElement | null;
    this.frameShapeRectBtn = document.getElementById('frame-shape-rect-btn') as HTMLButtonElement | null;
    this.frameZoomSlider = document.getElementById('frame-zoom-slider') as HTMLInputElement | null;
    this.frameZoomValEl = document.getElementById('frame-zoom-val');
    this.frameBorderColorInput = document.getElementById('frame-border-color') as HTMLInputElement | null;
    this.frameBorderColorHexEl = document.getElementById('frame-border-color-hex');
    this.frameBorderWidthInput = document.getElementById('frame-border-width') as HTMLInputElement | null;
    this.frameBorderWidthValEl = document.getElementById('frame-border-width-val');
    this.framePosLeftBtn = document.getElementById('frame-pos-left') as HTMLButtonElement | null;
    this.framePosCenterBtn = document.getElementById('frame-pos-center') as HTMLButtonElement | null;
    this.framePosRightBtn = document.getElementById('frame-pos-right') as HTMLButtonElement | null;
    this.frameRemovePhotoBtn = document.getElementById('frame-remove-photo-btn') as HTMLButtonElement | null;
    this.frameRemoveLayerBtn = document.getElementById('frame-remove-layer-btn') as HTMLButtonElement | null;
    this.frameAddBtn = document.getElementById('frame-add-btn') as HTMLButtonElement | null;

    // Accent Shapes hooks
    this.shapeStatusBadgeEl = document.getElementById('shape-status-badge');
    this.shapeAddRuleBtn = document.getElementById('shape-add-rule-btn') as HTMLButtonElement | null;
    this.shapeAddCardBtn = document.getElementById('shape-add-card-btn') as HTMLButtonElement | null;
    this.shapeAddBadgeBtn = document.getElementById('shape-add-badge-btn') as HTMLButtonElement | null;
    this.shapeActiveControlsEl = document.getElementById('shape-active-controls');
    this.shapeColorInput = document.getElementById('shape-color-input') as HTMLInputElement | null;
    this.shapeColorHexEl = document.getElementById('shape-color-hex');
    this.shapeOpacitySlider = document.getElementById('shape-opacity-slider') as HTMLInputElement | null;
    this.shapeOpacityValEl = document.getElementById('shape-opacity-val');
    this.shapeLayerLabelEl = document.getElementById('shape-layer-label');
    this.shapeRemoveBtn = document.getElementById('shape-remove-btn') as HTMLButtonElement | null;

    // Action toolbar, toast & clipboard
    this.btnUndoEl = document.getElementById('btn-undo') as HTMLButtonElement | null;
    this.btnRedoEl = document.getElementById('btn-redo') as HTMLButtonElement | null;
    this.btnShortcutsEl = document.getElementById('btn-shortcuts') as HTMLButtonElement | null;
    this.shortcutsModalEl = document.getElementById('shortcuts-modal');
    this.closeShortcutsModalBtn = document.getElementById('close-shortcuts-modal-btn') as HTMLButtonElement | null;
    this.toolToastEl = document.getElementById('tool-toast');
    this.toolToastTextEl = document.getElementById('tool-toast-text');
    this.copyClipboardBtn = document.getElementById('copy-clipboard-button') as HTMLButtonElement | null;

    // Motion Studio hooks
    this.motionCanvasEl = document.getElementById('motion-canvas') as HTMLCanvasElement | null;
    if (this.motionCanvasEl) {
      this.motionCtx = this.motionCanvasEl.getContext('2d');
    }
    this.motionToggleEl = document.getElementById('motion-toggle') as HTMLInputElement | null;
    this.motionSpeedSlider = document.getElementById('motion-speed-slider') as HTMLInputElement | null;
    this.motionSpeedValEl = document.getElementById('motion-speed-val');
    this.motionIntensitySlider = document.getElementById('motion-intensity-slider') as HTMLInputElement | null;
    this.motionIntensityValEl = document.getElementById('motion-intensity-val');
    this.motionRecordVideoBtn = document.getElementById('motion-record-video-btn') as HTMLButtonElement | null;
    this.motionCopyObsBtn = document.getElementById('motion-copy-obs-btn') as HTMLButtonElement | null;
    this.motionCopyCssBtn = document.getElementById('motion-copy-css-btn') as HTMLButtonElement | null;
  }

  /**
   * Session restoration with D-10 handling
   */
  private restoreSessionOrPreset(): void {
    if (this.mode === 'make') {
      const urlParams = new URLSearchParams(window.location.search);
      const templateParam = urlParams.get('template');
      const downloadParam = urlParams.get('download') === '1' || urlParams.get('action') === 'download';
      if (templateParam) {
        const tmpl = getTemplate(templateParam);
        if (tmpl) {
          this.loadTemplate(tmpl);
          this.phase = 'READY';
          this.updatePhaseUI();
          this.scheduleFrame();
          if (downloadParam) {
            setTimeout(() => {
              this.handleExportAction();
            }, 300);
          }
          return;
        }
      }

      try {
        const raw = sessionStorage.getItem(SCENE_KEY);
        if (raw) {
          const parsed = deserializeScene(raw);
          if (parsed) {
            this.scene = parsed;
            const frameLayer = this.scene.layers.find((l) => l.type === 'frame' && l.src) as PhotoFrameLayer | undefined;
            if (frameLayer && frameLayer.src && !this.images.has(frameLayer.src)) {
              const fImg = new Image();
              fImg.onload = () => {
                this.images.set(frameLayer.src!, fImg);
                this.scheduleFrame();
              };
              fImg.src = frameLayer.src;
              if (fImg.complete && fImg.naturalWidth > 0) {
                this.images.set(frameLayer.src, fImg);
                this.scheduleFrame();
              }
            }
            if (parsed.background.type === 'image') {
              if (parsed.background.src && parsed.background.src.startsWith('data:image/')) {
                const dataUrl = parsed.background.src;
                this.sourceDataUrl = dataUrl;
                const headerIndex = dataUrl.indexOf(',');
                if (headerIndex !== -1) {
                  this.sourceFileSize = Math.round((dataUrl.length - headerIndex - 1) * 3 / 4);
                }
                if (this.scene.background.type === 'image') {
                  this.scene.background.src = 'user-bg';
                }

                this.loadImageFromDataUrl(dataUrl, () => {
                  this.phase = 'READY';
                  this.updatePhaseUI();
                  this.syncMakeControlsFromScene();
                  this.updateZoomControlsRange();
                  this.scheduleFrame();
                });
                return;
              } else if (parsed.background.src) {
                const bgSrc = parsed.background.src;
                const bgImg = new Image();
                bgImg.onload = () => {
                  this.images.set(bgSrc, bgImg);
                  this.phase = 'READY';
                  this.updatePhaseUI();
                  this.syncMakeControlsFromScene();
                  this.scheduleFrame();
                };
                bgImg.src = bgSrc;
                return;
              } else {
                this.phase = 'NEEDS_SOURCE';
                this.updatePhaseUI();
                return;
              }
            } else {
              this.phase = 'READY';
              this.updatePhaseUI();
              this.syncMakeControlsFromScene();
              this.scheduleFrame();
              return;
            }
          }
        }
      } catch {
        // Fallback to default template
      }

      // Default boot: load gaming-retro
      const defaultTmpl = getTemplate('gaming-retro') || TEMPLATES[0];
      if (defaultTmpl) {
        this.loadTemplate(defaultTmpl);
      }
      this.phase = 'READY';
      this.updatePhaseUI();
      this.scheduleFrame();
      return;
    }

    try {
      const raw = sessionStorage.getItem(SCENE_KEY);
      if (raw) {
        const parsed = deserializeScene(raw);
        if (parsed) {
          this.scene = parsed;
          if (parsed.background.type === 'image') {
            if (parsed.background.src && parsed.background.src.startsWith('data:image/')) {
              // Image survived session below 3 MB
              const dataUrl = parsed.background.src;
              this.sourceDataUrl = dataUrl;
              const headerIndex = dataUrl.indexOf(',');
              if (headerIndex !== -1) {
                this.sourceFileSize = Math.round((dataUrl.length - headerIndex - 1) * 3 / 4);
              }
              // Normalise background src to key 'user-bg'
              if (this.scene.background.type === 'image') {
                this.scene.background.src = 'user-bg';
              }

              this.loadImageFromDataUrl(dataUrl, () => {
                this.phase = 'READY';
                this.updatePhaseUI();
                this.updateZoomControlsRange();
                this.scheduleFrame();
              });
              return;
            } else {
              // D-10: Image exceeded 3 MB and was stripped before storage
              this.phase = 'NEEDS_SOURCE';
              this.updatePhaseUI();
              return;
            }
          } else {
            // Restored non-image scene from Make Door
            this.phase = 'READY';
            this.updatePhaseUI();
            this.scheduleFrame();
            return;
          }
        }
      }
    } catch {
      // Fallback to default
    }

    if (this.mode === 'fix' || this.mode === 'check') {
      this.phase = 'EMPTY';
    } else {
      this.phase = 'READY';
    }
    this.updatePhaseUI();
  }

  /**
   * UI updates corresponding to application phase (§D.1)
   */
  private updatePhaseUI(): void {
    if (this.dropzoneEl) {
      if (this.phase === 'EMPTY' || this.phase === 'ERROR') {
        this.dropzoneEl.classList.remove('hidden');
      } else {
        this.dropzoneEl.classList.add('hidden');
      }
    }

    if (this.restoreNoticeEl) {
      if (this.phase === 'NEEDS_SOURCE') {
        this.restoreNoticeEl.classList.remove('hidden');
      } else {
        this.restoreNoticeEl.classList.add('hidden');
      }
    }

    if (this.exportButton) {
      this.exportButton.disabled = this.phase !== 'READY';
    }
    if (this.exportThumbnailBtn) {
      this.exportThumbnailBtn.disabled = this.phase !== 'READY';
    }
    if (this.exportAvatarBtn) {
      this.exportAvatarBtn.disabled = this.phase !== 'READY';
    }

    if (this.verdictCountBadge) {
      if (this.phase === 'EMPTY') {
        this.verdictCountBadge.textContent = clientI18n?.diagnostics?.awaiting || 'Awaiting image';
      } else if (this.phase === 'NEEDS_SOURCE') {
        this.verdictCountBadge.textContent = clientI18n?.diagnostics?.actionNeeded || 'Action needed';
      }
    }

    if (this.verdictEmptyEl) {
      if (this.phase === 'EMPTY' || this.phase === 'NEEDS_SOURCE') {
        this.verdictEmptyEl.classList.remove('hidden');
      } else {
        this.verdictEmptyEl.classList.add('hidden');
      }
    }

    if (this.verdictAllClearEl && this.phase !== 'READY') {
      this.verdictAllClearEl.classList.add('hidden');
    }
  }

  /**
   * Wire all event listeners routing into applyChange funnel (D-8)
   */
  private wireEvents(): void {
    // 0. Check Mode Handoff Button (REQ-E13, Gate 4)
    if (this.handoffFixBtn) {
      this.handoffFixBtn.addEventListener('click', () => {
        this.handoffToFixEditor();
      });
    }

    // 1. File Upload / Dropzone
    if (this.uploadInputEl) {
      this.uploadInputEl.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) this.handleFileUpload(file);
      });
    }

    if (this.browseBtn) {
      this.browseBtn.addEventListener('click', () => this.uploadInputEl?.click());
    }
    if (this.reuploadBtn) {
      this.reuploadBtn.addEventListener('click', () => this.uploadInputEl?.click());
    }

    // Drag and drop onto editor / dropzone
    const dropTarget = this.editorEl;
    if (dropTarget) {
      ['dragenter', 'dragover'].forEach((eventName) => {
        dropTarget.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dragOverlayEl?.classList.remove('opacity-0');
        });
      });

      ['dragleave', 'drop'].forEach((eventName) => {
        dropTarget.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.dragOverlayEl?.classList.add('opacity-0');
        });
      });

      dropTarget.addEventListener('drop', (e) => {
        const file = (e as DragEvent).dataTransfer?.files?.[0];
        if (file) this.handleFileUpload(file);
      });
    }

    // 2. Pointer Drag & Multi-Touch Gestures on Canvas (REQ-E2, REQ-E3)
    if (this.canvasEl) {
      this.canvasEl.addEventListener('pointerdown', (e) => {
        if (this.phase !== 'READY' || this.mode === 'check') return;
        this.pushUndo(this.scene);

        // In make mode, check if clicked inside any editable text layer
        if (this.mode === 'make') {
          const rect = this.canvasEl.getBoundingClientRect();
          const clickFracX = (e.clientX - rect.left) / rect.width;
          const clickFracY = (e.clientY - rect.top) / rect.height;

          let hitFrame: PhotoFrameLayer | null = null;
          for (let i = this.scene.layers.length - 1; i >= 0; i--) {
            const layer = this.scene.layers[i];
            if (layer.type === 'frame') {
              const halfW = (layer.w || 0.11) / 2;
              const halfH = (layer.h || 0.1944) / 2;
              if (
                clickFracX >= layer.x - halfW &&
                clickFracX <= layer.x + halfW &&
                clickFracY >= layer.y - halfH &&
                clickFracY <= layer.y + halfH
              ) {
                hitFrame = layer;
                break;
              }
            }
          }

          if (hitFrame) {
            this.switchDeckTab('photo');
            this.draggingFrameLayerId = hitFrame.id;
            this.canvasEl.setPointerCapture(e.pointerId);
            this.pointerDragStartFracX = clickFracX;
            this.pointerDragStartFracY = clickFracY;
            this.frameDragStartPosX = hitFrame.x;
            this.frameDragStartPosY = hitFrame.y;
            this.hasDraggedFrame = false;
            return;
          }

          let hitLayer: TextLayer | null = null;
          for (let i = this.scene.layers.length - 1; i >= 0; i--) {
            const layer = this.scene.layers[i];
            if (layer.type === 'text') {
              if (
                this.currentTemplateManifest &&
                this.currentTemplateManifest.protected.includes(layer.id)
              ) {
                continue; // Protected elements cannot be selected or moved
              }
              const bounds = estimateTextBounds(layer);
              const padX = 0.04;
              const padY = 0.04;
              if (
                clickFracX >= bounds.minX - padX &&
                clickFracX <= bounds.maxX + padX &&
                clickFracY >= bounds.minY - padY &&
                clickFracY <= bounds.maxY + padY
              ) {
                hitLayer = layer;
                break;
              }
            }
          }

          if (hitLayer) {
            this.switchDeckTab('text');
            this.draggingTextLayerId = hitLayer.id;
            this.canvasEl.setPointerCapture(e.pointerId);
            this.pointerDragStartFracX = clickFracX;
            this.pointerDragStartFracY = clickFracY;
            this.layerDragStartPosX = hitLayer.position.x;
            this.layerDragStartPosY = hitLayer.position.y;
            return;
          }
        }

        if (this.scene.background.type !== 'image') return;
        this.canvasEl.setPointerCapture(e.pointerId);
        this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (this.activePointers.size === 1) {
          this.isPointerDown = true;
          this.pointerStartX = e.clientX;
          this.pointerStartY = e.clientY;
          this.initialOffsetX = this.scene.background.offsetX;
          this.initialOffsetY = this.scene.background.offsetY;
        } else if (this.activePointers.size === 2) {
          // Initialize pinch gesture
          this.isPointerDown = false;
          const [p1, p2] = Array.from(this.activePointers.values());
          this.initialPinchDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          this.initialPinchZoom = this.scene.background.zoom;
        }
      });

      this.canvasEl.addEventListener('pointermove', (e) => {
        // If dragging photo frame in make mode
        if (this.draggingFrameLayerId) {
          const rect = this.canvasEl.getBoundingClientRect();
          const currentFracX = (e.clientX - rect.left) / rect.width;
          const currentFracY = (e.clientY - rect.top) / rect.height;
          const dx = currentFracX - this.pointerDragStartFracX;
          const dy = currentFracY - this.pointerDragStartFracY;

          if (Math.hypot(dx, dy) > 0.005) {
            this.hasDraggedFrame = true;
          }

          const frame = this.scene.layers.find(
            (l) => l.type === 'frame' && l.id === this.draggingFrameLayerId
          ) as PhotoFrameLayer | undefined;

          if (frame) {
            frame.x = Math.max(0.1, Math.min(0.9, this.frameDragStartPosX + dx));
            frame.y = Math.max(0.35, Math.min(0.65, this.frameDragStartPosY + dy));
            this.applyChange({ layers: [...this.scene.layers] });
          }
          return;
        }

        // If dragging text layer in make mode
        if (this.draggingTextLayerId) {
          const rect = this.canvasEl.getBoundingClientRect();
          const currentFracX = (e.clientX - rect.left) / rect.width;
          const currentFracY = (e.clientY - rect.top) / rect.height;
          const dx = currentFracX - this.pointerDragStartFracX;
          const dy = currentFracY - this.pointerDragStartFracY;

          const layer = this.scene.layers.find(
            (l) => l.type === 'text' && l.id === this.draggingTextLayerId
          ) as TextLayer | undefined;

          if (layer) {
            layer.position.x = Math.max(0.01, Math.min(0.99, this.layerDragStartPosX + dx));
            layer.position.y = Math.max(0.01, Math.min(0.99, this.layerDragStartPosY + dy));
            this.applyChange({ layers: [...this.scene.layers] });
          }
          return;
        }

        if (this.scene.background.type !== 'image') return;
        if (!this.activePointers.has(e.pointerId)) return;
        this.activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (this.activePointers.size === 2 && this.initialPinchDist > 0) {
          // Pinch-to-zoom update
          const [p1, p2] = Array.from(this.activePointers.values());
          const currentDist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          const zoomRatio = currentDist / this.initialPinchDist;
          this.setZoom(this.initialPinchZoom * zoomRatio);
        } else if (this.isPointerDown && this.activePointers.size === 1) {
          // One-finger or mouse drag update
          const dx = e.clientX - this.pointerStartX;
          const dy = e.clientY - this.pointerStartY;

          const rect = this.canvasEl.getBoundingClientRect();
          const scaleX = CANVAS.width / rect.width;
          const scaleY = CANVAS.height / rect.height;

          this.applyChange({
            background: {
              ...this.scene.background,
              offsetX: this.initialOffsetX + dx * scaleX,
              offsetY: this.initialOffsetY + dy * scaleY,
            },
          });
        }
      });

      const stopDrag = (e: PointerEvent) => {
        if (this.draggingFrameLayerId) {
          const frameId = this.draggingFrameLayerId;
          const wasDragged = this.hasDraggedFrame;
          this.draggingFrameLayerId = null;
          this.hasDraggedFrame = false;
          try {
            this.canvasEl.releasePointerCapture(e.pointerId);
          } catch {
            // Ignore release errors
          }
          if (!wasDragged) {
            const frame = this.scene.layers.find(
              (l) => l.type === 'frame' && l.id === frameId
            ) as PhotoFrameLayer | undefined;
            if (frame && !frame.src) {
              this.frameFileInputEl?.click();
            }
          }
          return;
        }

        if (this.draggingTextLayerId) {
          this.draggingTextLayerId = null;
          try {
            this.canvasEl.releasePointerCapture(e.pointerId);
          } catch {
            // Ignore release errors
          }
          return;
        }

        this.activePointers.delete(e.pointerId);
        try {
          this.canvasEl.releasePointerCapture(e.pointerId);
        } catch {
          // Ignore release errors
        }

        if (this.activePointers.size === 1) {
          const remaining = Array.from(this.activePointers.values())[0];
          this.isPointerDown = true;
          this.pointerStartX = remaining.x;
          this.pointerStartY = remaining.y;
          if (this.scene.background.type === 'image') {
            this.initialOffsetX = this.scene.background.offsetX;
            this.initialOffsetY = this.scene.background.offsetY;
          }
        } else if (this.activePointers.size === 0) {
          this.isPointerDown = false;
          this.initialPinchDist = 0;
        }
      };

      this.canvasEl.addEventListener('pointerup', stopDrag);
      this.canvasEl.addEventListener('pointercancel', stopDrag);

      // Wheel Zoom over Canvas (REQ-E3)
      this.canvasEl.addEventListener(
        'wheel',
        (e) => {
          if (this.phase !== 'READY' || this.scene.background.type !== 'image' || this.mode === 'check') return;
          e.preventDefault();
          const delta = e.deltaY < 0 ? 0.05 : -0.05;
          this.adjustZoom(delta);
        },
        { passive: false }
      );

      // Keyboard pan & zoom fallback on Canvas (REQ-E2, REQ-E3)
      this.canvasEl.addEventListener('keydown', (e) => {
        if (this.phase !== 'READY' || this.scene.background.type !== 'image' || this.mode === 'check') return;
        const step = e.shiftKey ? 40 : 10;
        let newX = this.scene.background.offsetX;
        let newY = this.scene.background.offsetY;

        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.applyChange({ background: { ...this.scene.background, offsetX: newX - step } });
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.applyChange({ background: { ...this.scene.background, offsetX: newX + step } });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.applyChange({ background: { ...this.scene.background, offsetY: newY - step } });
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.applyChange({ background: { ...this.scene.background, offsetY: newY + step } });
        } else if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          this.adjustZoom(0.05);
        } else if (e.key === '-' || e.key === '_') {
          e.preventDefault();
          this.adjustZoom(-0.05);
        }
      });
    }

    // 3. Zoom Controls (REQ-E3)
    if (this.zoomSlider) {
      this.zoomSlider.addEventListener('pointerdown', () => {
        this.pushUndo(this.scene);
      });
      this.zoomSlider.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value);
        this.setZoom(val);
      });
    }
    if (this.zoomInBtn) {
      this.zoomInBtn.addEventListener('click', () => this.adjustZoom(0.05));
    }
    if (this.zoomOutBtn) {
      this.zoomOutBtn.addEventListener('click', () => this.adjustZoom(-0.05));
    }

    // 4. Pan Nudge Controls (REQ-E2)
    if (this.panUpBtn) {
      this.panUpBtn.addEventListener('click', () => this.nudge(0, -25));
    }
    if (this.panDownBtn) {
      this.panDownBtn.addEventListener('click', () => this.nudge(0, 25));
    }
    if (this.panLeftBtn) {
      this.panLeftBtn.addEventListener('click', () => this.nudge(-25, 0));
    }
    if (this.panRightBtn) {
      this.panRightBtn.addEventListener('click', () => this.nudge(25, 0));
    }
    if (this.panCenterBtn) {
      this.panCenterBtn.addEventListener('click', () => this.centerPosition());
    }
    if (this.panResetBtn) {
      this.panResetBtn.addEventListener('click', () => this.resetReposition());
    }

    // 5. Extend Background Toggle (REQ-009, REQ-E8)
    if (this.extendToggle) {
      this.extendToggle.addEventListener('change', (e) => {
        if (this.scene.background.type === 'image') {
          this.applyChange({
            background: {
              ...this.scene.background,
              extend: (e.target as HTMLInputElement).checked,
            },
          });
        }
      });
    }

    // 6. Device Tabs Switcher with Roving Tabindex Keyboard Navigation (REQ-E4)
    const deviceOrder: DeviceKey[] = ['mobile', 'desktop', 'tablet', 'tv'];
    this.deviceTabButtons.forEach((btn, dev) => {
      btn.addEventListener('click', () => this.selectDevice(dev));
    });

    if (this.deviceTabsContainer) {
      this.deviceTabsContainer.addEventListener('keydown', (e) => {
        const currentIdx = deviceOrder.indexOf(this.activeDevice);
        let targetDev: DeviceKey | null = null;

        if (e.key === 'ArrowRight') {
          e.preventDefault();
          targetDev = deviceOrder[(currentIdx + 1) % deviceOrder.length];
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          targetDev = deviceOrder[(currentIdx - 1 + deviceOrder.length) % deviceOrder.length];
        } else if (e.key === 'Home') {
          e.preventDefault();
          targetDev = deviceOrder[0];
        } else if (e.key === 'End') {
          e.preventDefault();
          targetDev = deviceOrder[deviceOrder.length - 1];
        }

        if (targetDev) {
          this.selectDevice(targetDev);
          this.deviceTabButtons.get(targetDev)?.focus();
        }
      });
    }

    // 7. Simulation Toggle (REQ-E9)
    if (this.simulateToggle) {
      this.simulateToggle.addEventListener('change', (e) => {
        const checked = (e.target as HTMLInputElement).checked;
        if (this.simulatePanel) {
          if (checked) {
            this.simulatePanel.classList.remove('hidden');
            this.runSimulation();
          } else {
            this.simulatePanel.classList.add('hidden');
          }
        }
      });
    }

    // 8. Export Format & Button (REQ-E10, E-11, §D.2)
    if (this.exportFormatSelect) {
      this.exportFormatSelect.addEventListener('change', (e) => {
        const format = (e.target as HTMLSelectElement).value as 'png' | 'jpeg' | 'webp';
        this.applyChange({
          export: {
            ...this.scene.export,
            format,
          },
        });
      });
    }

    if (this.exportButton) {
      this.exportButton.addEventListener('click', () => this.handleExportAction());
    }

    if (this.exportThumbnailBtn) {
      this.exportThumbnailBtn.addEventListener('click', () => this.handleThumbnailExport());
    }
    if (this.exportAvatarBtn) {
      this.exportAvatarBtn.addEventListener('click', () => this.handleAvatarExport());
    }

    // 9. Action Toolbar (Undo, Redo, Shortcuts)
    this.btnUndoEl?.addEventListener('click', () => this.undo());
    this.btnRedoEl?.addEventListener('click', () => this.redo());
    this.btnShortcutsEl?.addEventListener('click', () => this.toggleShortcutsModal());
    this.closeShortcutsModalBtn?.addEventListener('click', () => this.toggleShortcutsModal());
    this.shortcutsModalEl?.addEventListener('click', (e) => {
      if (e.target === this.shortcutsModalEl) {
        this.shortcutsModalEl?.classList.add('hidden');
      }
    });

    // 10. Copy Image to Clipboard
    if (this.copyClipboardBtn) {
      this.copyClipboardBtn.addEventListener('click', () => this.copyToClipboard());
    }

    // 11. Canvas Double-click to center & reset zoom
    if (this.canvasEl) {
      this.canvasEl.addEventListener('dblclick', () => {
        if (this.phase !== 'READY' || this.scene.background.type !== 'image' || this.mode === 'check') return;
        this.pushUndo(this.scene);
        this.applyChange({
          background: {
            ...this.scene.background,
            offsetX: 0,
            offsetY: 0,
            zoom: 1,
          },
        });
        this.showToast('Centered artwork');
      });
    }

    // 12. Global Drag & Drop safety (prevent browser navigating away if dropped outside)
    ['dragover', 'drop'].forEach((eventName) => {
      window.addEventListener(eventName, (e) => {
        e.preventDefault();
      });
    });

    // 13. Global Clipboard Paste (Cmd+V / Ctrl+V)
    window.addEventListener('paste', (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if (isInput) return;

      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            this.handleFileUpload(file);
            this.showToast('Loaded image from clipboard');
            break;
          }
        }
      }
    });

    // 14. Global Keyboard Shortcuts (Viewports 1-4, 0, Undo/Redo, ?, Esc)
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT');

      if (e.key === 'Escape') {
        if (this.templatePickerModalEl && !this.templatePickerModalEl.classList.contains('hidden')) {
          this.templatePickerModalEl.classList.add('hidden');
        }
        if (this.shortcutsModalEl && !this.shortcutsModalEl.classList.contains('hidden')) {
          this.shortcutsModalEl.classList.add('hidden');
        }
      }

      if (isInput) return;

      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        this.toggleShortcutsModal();
        return;
      }

      // Device tab shortcuts 1, 2, 3, 4
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          this.selectDevice('mobile');
          this.showToast(`Mobile Safe Area (${SAFE_PX.full.width} × ${SAFE_PX.full.height})`);
        } else if (e.key === '2') {
          e.preventDefault();
          this.selectDevice('desktop');
          this.showToast(`Desktop Viewport (${Math.round(DEVICES.desktop.w * CANVAS.width)} × ${Math.round(DEVICES.desktop.h * CANVAS.height)})`);
        } else if (e.key === '3') {
          e.preventDefault();
          this.selectDevice('tablet');
          this.showToast(`Tablet Viewport (${Math.round(DEVICES.tablet.w * CANVAS.width)} × ${Math.round(DEVICES.tablet.h * CANVAS.height)})`);
        } else if (e.key === '4') {
          e.preventDefault();
          this.selectDevice('tv');
          this.showToast(`TV Full Frame (${CANVAS.width} × ${CANVAS.height})`);
        } else if (e.key === '0') {
          if (this.phase === 'READY' && this.scene.background.type === 'image' && this.mode !== 'check') {
            e.preventDefault();
            this.pushUndo(this.scene);
            this.applyChange({
              background: {
                ...this.scene.background,
                offsetX: 0,
                offsetY: 0,
                zoom: 1,
              },
            });
            this.showToast('Reset zoom & centered');
          }
        }
      }

      // Undo / Redo
      if ((e.metaKey || e.ctrlKey) && !e.altKey) {
        if (e.key === 'z' || e.key === 'Z') {
          e.preventDefault();
          if (e.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
        } else if (e.key === 'y' || e.key === 'Y') {
          e.preventDefault();
          this.redo();
        }
      }
    });

    // Window resize handler for canvas display scale
    window.addEventListener('resize', () => {
      if (this.phase === 'READY') {
        this.scheduleFrame();
      }
    });

    // Initialize initial device guides state
    this.selectDevice('mobile');

    // Wire Create Door events
    this.wireMakeEvents();
  }

  /**
   * Wire all Create Door events (mode === 'make')
   */
  private wireMakeEvents(): void {
    if (this.mode !== 'make') return;

    // 1. Open template modal
    this.changeTemplateBtn?.addEventListener('click', () => {
      this.templatePickerModalEl?.classList.remove('hidden');
    });

    // 2. Close template modal
    this.closeTemplateModalBtn?.addEventListener('click', () => {
      this.templatePickerModalEl?.classList.add('hidden');
    });

    // 3. Backdrop click to close modal
    this.templatePickerModalEl?.addEventListener('click', (e) => {
      if (e.target === this.templatePickerModalEl) {
        this.templatePickerModalEl?.classList.add('hidden');
      }
    });

    // 4. Start blank canvas (REQ-015)
    this.startBlankBtn?.addEventListener('click', () => {
      this.loadBlank();
      this.templatePickerModalEl?.classList.add('hidden');
    });

    // 6. Select template from modal cards
    const selectBtns = document.querySelectorAll<HTMLButtonElement>('.select-template-btn');
    selectBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-template-id');
        if (id) {
          const tmpl = getTemplate(id);
          if (tmpl) {
            this.loadTemplate(tmpl);
            this.templatePickerModalEl?.classList.add('hidden');
            this.scheduleFrame();
          }
        }
      });
    });

    // 6b. Free PNG direct download from modal cards
    const downloadBtns = document.querySelectorAll<HTMLButtonElement>('.download-template-btn');
    downloadBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-template-id');
        if (id) {
          const tmpl = getTemplate(id);
          if (tmpl) {
            this.loadTemplate(tmpl);
            this.templatePickerModalEl?.classList.add('hidden');
            this.scheduleFrame();
            setTimeout(() => {
              this.handleExportAction();
            }, 200);
          }
        }
      });
    });

    // 7. Filter template modal by niche pills (REQ-021)
    const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-niche-btn');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetNiche = btn.getAttribute('data-filter-niche') || 'all';
        filterBtns.forEach((b) => {
          b.classList.remove('bg-ink-950', 'text-surface-0', 'active-pill');
          b.classList.add('bg-surface-50', 'text-ink-700', 'border', 'border-line-200');
        });
        btn.classList.add('bg-ink-950', 'text-surface-0', 'active-pill');
        btn.classList.remove('bg-surface-50', 'text-ink-700', 'border', 'border-line-200');

        const cards = document.querySelectorAll<HTMLElement>('[data-template-card]');
        cards.forEach((card) => {
          const cardNiche = card.getAttribute('data-niche') || '';
          if (targetNiche === 'all' || cardNiche === targetNiche) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });

    // 8. Background Type Switcher
    this.bgTypeGradientBtn?.addEventListener('click', () => {
      this.activateBgType('gradient');
      this.makePhotoRepositionWrap?.classList.add('hidden');
      const from = this.bgGradientFromInput?.value || '#1a0033';
      const to = this.bgGradientToInput?.value || '#330066';
      const angle = parseInt(this.bgGradientAngleInput?.value || '135', 10);
      this.applyChange({ background: { type: 'gradient', from, to, angle } });
    });

    this.bgTypeSolidBtn?.addEventListener('click', () => {
      this.activateBgType('solid');
      this.makePhotoRepositionWrap?.classList.add('hidden');
      const color = this.bgSolidColorInput?.value || '#111215';
      this.applyChange({ background: { type: 'solid', color } });
    });

    this.bgTypePhotoBtn?.addEventListener('click', () => {
      this.activateBgType('photo');
      if (this.scene.background.type === 'image') {
        this.makePhotoRepositionWrap?.classList.remove('hidden');
      }
    });

    // 9. Gradient Inputs
    const updateGradient = () => {
      const from = this.bgGradientFromInput?.value || '#1a0033';
      const to = this.bgGradientToInput?.value || '#330066';
      const angle = parseInt(this.bgGradientAngleInput?.value || '135', 10);
      if (this.bgGradientFromHexEl) this.bgGradientFromHexEl.textContent = from;
      if (this.bgGradientToHexEl) this.bgGradientToHexEl.textContent = to;
      if (this.bgGradientAngleValEl) this.bgGradientAngleValEl.textContent = `${angle}°`;
      this.applyChange({ background: { type: 'gradient', from, to, angle } });
    };

    this.bgGradientFromInput?.addEventListener('input', updateGradient);
    this.bgGradientToInput?.addEventListener('input', updateGradient);
    this.bgGradientAngleInput?.addEventListener('input', updateGradient);

    // 10. Solid Color Input
    this.bgSolidColorInput?.addEventListener('input', () => {
      const color = this.bgSolidColorInput?.value || '#111215';
      if (this.bgSolidColorHexEl) this.bgSolidColorHexEl.textContent = color;
      this.applyChange({ background: { type: 'solid', color } });
    });

    // 11. Photo Upload
    this.bgPhotoUploadBtn?.addEventListener('click', () => {
      this.bgPhotoFileInput?.click();
    });

    this.bgPhotoFileInput?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) this.handleMakePhotoUpload(file);
    });

    // 12. Instant Curated Background Styles & Palette Harmonizer (1-Click)
    const BG_COLOR_HARMONIES: Record<string, { titleColor: string; taglineColor: string; frameBorderColor: string }> = {
      crimson: { titleColor: '#FFFFFF', taglineColor: '#F4D35E', frameBorderColor: '#E63946' },
      pearl: { titleColor: '#F62440', taglineColor: '#4A4E54', frameBorderColor: '#F62440' },
      noir_rose: { titleColor: '#EEEEEE', taglineColor: '#CB2957', frameBorderColor: '#CB2957' },
      carbon: { titleColor: '#FFFFFF', taglineColor: '#9CA3AF', frameBorderColor: '#FFFFFF' },
      noir: { titleColor: '#F3F4F6', taglineColor: '#9CA3AF', frameBorderColor: '#E5E7EB' },
      indigo: { titleColor: '#FFFFFF', taglineColor: '#A5B4FC', frameBorderColor: '#6366F1' },
      nordic: { titleColor: '#F7F8F9', taglineColor: '#D1D5DB', frameBorderColor: '#F7F8F9' },
      sunset: { titleColor: '#FFFFFF', taglineColor: '#FED7AA', frameBorderColor: '#FF7A00' },
      emerald: { titleColor: '#FFFFFF', taglineColor: '#6EE7B7', frameBorderColor: '#10B981' },
      charcoal: { titleColor: '#FFFFFF', taglineColor: '#9CA3AF', frameBorderColor: '#FFFFFF' },
      clean: { titleColor: '#0B0F19', taglineColor: '#4B5563', frameBorderColor: '#0B0F19' },
    };

    const presetBtns = document.querySelectorAll<HTMLButtonElement>('.bg-preset-btn');
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        if (presetKey && this.BG_STYLE_PRESETS[presetKey]) {
          const bg = this.BG_STYLE_PRESETS[presetKey];
          const harmony = BG_COLOR_HARMONIES[presetKey];

          if (harmony) {
            const title = this.scene.layers.find((l) => l.type === 'text' && l.id === 'title') as TextLayer | undefined;
            if (title) title.color = harmony.titleColor;

            const tagline = this.scene.layers.find((l) => l.type === 'text' && l.id === 'tagline') as TextLayer | undefined;
            if (tagline) tagline.color = harmony.taglineColor;

            const frame = this.getPhotoFrameLayer();
            if (frame) frame.borderColor = harmony.frameBorderColor;
          }

          this.applyChange({ background: bg, layers: [...this.scene.layers] });
          this.syncBackgroundControls();
          this.renderTextLayerControls();
          this.syncPhotoFrameControls();
          this.showToast(`Applied ${presetKey} style`);
        }
      });
    });

    // 13. Photo Frame & Avatar Controls
    this.frameUploadBtn?.addEventListener('click', () => {
      this.frameFileInputEl?.click();
    });

    this.frameFileInputEl?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) this.handleFramePhotoUpload(file);
    });

    this.frameShapeCircleBtn?.addEventListener('click', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame) {
        frame.shape = 'circle';
        frame.w = 0.10;
        frame.h = 0.1778;
        this.applyChange({ layers: [...this.scene.layers] });
        this.syncPhotoFrameControls();
      }
    });

    this.frameShapeRectBtn?.addEventListener('click', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame) {
        frame.shape = 'rect';
        frame.w = 0.09;
        frame.h = 0.20;
        frame.borderRadius = 12;
        this.applyChange({ layers: [...this.scene.layers] });
        this.syncPhotoFrameControls();
      }
    });

    this.frameZoomSlider?.addEventListener('input', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame && this.frameZoomSlider) {
        const z = parseFloat(this.frameZoomSlider.value);
        frame.zoom = z;
        if (this.frameZoomValEl) this.frameZoomValEl.textContent = `${z.toFixed(1)}×`;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.frameBorderColorInput?.addEventListener('input', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame && this.frameBorderColorInput) {
        const c = this.frameBorderColorInput.value;
        frame.borderColor = c;
        if (this.frameBorderColorHexEl) this.frameBorderColorHexEl.textContent = c;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.frameBorderWidthInput?.addEventListener('input', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame && this.frameBorderWidthInput) {
        const w = parseInt(this.frameBorderWidthInput.value, 10);
        frame.borderWidth = w;
        if (this.frameBorderWidthValEl) this.frameBorderWidthValEl.textContent = `${w}px`;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.framePosLeftBtn?.addEventListener('click', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame) {
        frame.x = 0.28;
        frame.y = 0.50;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.framePosCenterBtn?.addEventListener('click', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame) {
        frame.x = 0.50;
        frame.y = 0.50;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.framePosRightBtn?.addEventListener('click', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame) {
        frame.x = 0.72;
        frame.y = 0.50;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.frameRemovePhotoBtn?.addEventListener('click', () => {
      const frame = this.getPhotoFrameLayer();
      if (frame && frame.src) {
        delete frame.src;
        this.applyChange({ layers: [...this.scene.layers] });
        this.syncPhotoFrameControls();
        this.showToast('Photo removed from frame');
      }
    });

    this.frameRemoveLayerBtn?.addEventListener('click', () => {
      this.scene.layers = this.scene.layers.filter((l) => l.type !== 'frame');
      this.applyChange({ layers: [...this.scene.layers] });
      this.syncPhotoFrameControls();
      this.showToast('Photo frame removed');
    });

    this.frameAddBtn?.addEventListener('click', () => {
      let frame = this.getPhotoFrameLayer();
      if (!frame) {
        const newFrame: PhotoFrameLayer = {
          id: 'avatar-frame',
          type: 'frame',
          shape: 'circle',
          x: 0.28,
          y: 0.50,
          w: 0.10,
          h: 0.1778,
          borderWidth: 3,
          borderColor: '#FFFFFF',
          safeAreaConstrained: true,
        };
        this.scene.layers.push(newFrame);
        this.applyChange({ layers: [...this.scene.layers] });
        this.syncPhotoFrameControls();
        this.showToast('Photo frame added to canvas');
      }
    });

    // 14. Accent Shapes & Framing Controls
    this.shapeAddRuleBtn?.addEventListener('click', () => {
      const rule: ShapeLayer = {
        id: `shape-rule-${Date.now()}`,
        type: 'shape',
        shape: 'rect',
        x: 0.35,
        y: 0.43,
        w: 0.05,
        h: 0.003,
        color: '#FFFFFF',
        opacity: 0.8,
      };
      this.scene.layers.push(rule);
      this.applyChange({ layers: [...this.scene.layers] });
      this.syncShapeControls();
      this.showToast('Accent rule added');
    });

    this.shapeAddCardBtn?.addEventListener('click', () => {
      const card: ShapeLayer = {
        id: `shape-card-${Date.now()}`,
        type: 'shape',
        shape: 'rect',
        x: 0.22,
        y: 0.38,
        w: 0.56,
        h: 0.24,
        color: '#FFFFFF',
        opacity: 0.06,
        borderRadius: 16,
      };
      this.scene.layers.unshift(card);
      this.applyChange({ layers: [...this.scene.layers] });
      this.syncShapeControls();
      this.showToast('Backplate card added');
    });

    this.shapeAddBadgeBtn?.addEventListener('click', () => {
      const badge: ShapeLayer = {
        id: `shape-badge-${Date.now()}`,
        type: 'shape',
        shape: 'rect',
        x: 0.35,
        y: 0.39,
        w: 0.06,
        h: 0.016,
        color: '#FFFFFF',
        opacity: 0.15,
        borderRadius: 4,
      };
      this.scene.layers.push(badge);
      this.applyChange({ layers: [...this.scene.layers] });
      this.syncShapeControls();
      this.showToast('Brand badge added');
    });

    this.shapeColorInput?.addEventListener('input', () => {
      const shapes = this.getShapeLayers();
      if (shapes.length > 0 && this.shapeColorInput) {
        const color = this.shapeColorInput.value;
        shapes[shapes.length - 1].color = color;
        if (this.shapeColorHexEl) this.shapeColorHexEl.textContent = color;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.shapeOpacitySlider?.addEventListener('input', () => {
      const shapes = this.getShapeLayers();
      if (shapes.length > 0 && this.shapeOpacitySlider) {
        const op = parseFloat(this.shapeOpacitySlider.value);
        shapes[shapes.length - 1].opacity = op;
        if (this.shapeOpacityValEl) this.shapeOpacityValEl.textContent = `${Math.round(op * 100)}%`;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    this.shapeRemoveBtn?.addEventListener('click', () => {
      this.scene.layers = this.scene.layers.filter((l) => l.type !== 'shape');
      this.applyChange({ layers: [...this.scene.layers] });
      this.syncShapeControls();
      this.showToast('Shapes removed');
    });

    // 15. Cross-Door Handoff Action (REQ-022, Gate 6)
    this.handoffCheckBtn?.addEventListener('click', () => {
      this.persist();
      const m = window.location.pathname.match(/^\/(es|de|fr|pt-br|it|ja)\b/);
      const prefix = m ? m[0] : '';
      window.location.href = `${prefix}/tools/youtube-banner-checker`;
    });

    // 16. Fast Customizations: Smart Safe-Snap Engine (Certified Safe Presets)
    const snapBtns = document.querySelectorAll<HTMLButtonElement>('.snap-btn');
    snapBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const snap = btn.getAttribute('data-snap');
        this.applySafeSnap(snap);
      });
    });

    // Contrast Guard: Auto-Fit Text to Mobile Safe Area
    document.getElementById('btn-autofit-text')?.addEventListener('click', () => {
      const frame = this.getPhotoFrameLayer();
      const maxW = frame ? SAFE_PX.full.width * 0.58 : SAFE_PX.full.width * 0.85;
      const title = this.scene.layers.find((l) => l.type === 'text' && l.id === 'title') as TextLayer | undefined;
      if (title) {
        const newSize = fitTextToSafeArea(title.text, title.font || 'inter-900', maxW, title.size || 54);
        title.size = newSize;
      }
      const tagline = this.scene.layers.find((l) => l.type === 'text' && l.id === 'tagline') as TextLayer | undefined;
      if (tagline) {
        const maxTaglineW = frame ? SAFE_PX.full.width * 0.58 : SAFE_PX.full.width * 0.85;
        const newTaglineSize = fitTextToSafeArea(tagline.text, tagline.font || 'inter-500', maxTaglineW, Math.min(tagline.size || 22, 28));
        tagline.size = newTaglineSize;
      }
      this.applyChange({ layers: [...this.scene.layers] });
      this.renderTextLayerControls();
      this.showToast('Text scaled to fit mobile safe zone');
    });

    // Contrast Guard: Studio Scrim Slider
    const scrimSlider = document.getElementById('scrim-slider') as HTMLInputElement | null;
    const scrimValEl = document.getElementById('scrim-val');
    if (scrimSlider) {
      scrimSlider.addEventListener('input', () => {
        const val = parseInt(scrimSlider.value, 10);
        if (scrimValEl) scrimValEl.textContent = `${val}%`;
        const intensity = val / 100;
        const bg = { ...this.scene.background };
        bg.scrim = {
          enabled: intensity > 0,
          intensity,
          type: 'vignette',
        };
        this.applyChange({ background: bg });
      });
    }

    // Contrast Guard: Frosted Glass Aero Plate Toggle
    const aeroBtn = document.getElementById('toggle-aero-plate-btn') as HTMLButtonElement | null;
    if (aeroBtn) {
      aeroBtn.addEventListener('click', () => {
        const isCurrentlyEnabled = aeroBtn.getAttribute('data-enabled') === 'true';
        const nextEnabled = !isCurrentlyEnabled;
        aeroBtn.setAttribute('data-enabled', String(nextEnabled));
        aeroBtn.textContent = nextEnabled ? 'On' : 'Off';
        if (nextEnabled) {
          aeroBtn.classList.add('bg-accent', 'text-white', 'border-accent');
          aeroBtn.classList.remove('bg-surface-50', 'text-ink-800');
        } else {
          aeroBtn.classList.remove('bg-accent', 'text-white', 'border-accent');
          aeroBtn.classList.add('bg-surface-50', 'text-ink-800');
        }
        const layers = this.scene.layers.map((l) => {
          if (l.type === 'text') {
            return {
              ...l,
              aeroPlate: {
                enabled: nextEnabled,
                style: 'dark-frosted' as const,
                padding: 14,
              },
            };
          }
          return l;
        });
        this.applyChange({ layers });
        this.showToast(nextEnabled ? 'Frosted Aero Plate enabled' : 'Aero Plate disabled');
      });
    }

    // Multi-platform social handle chips
    const socialChips = document.querySelectorAll<HTMLButtonElement>('.social-platform-chip');
    socialChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const platform = chip.getAttribute('data-platform') as SocialPlatform;
        if (!platform) return;
        const badge = this.getBadgeLayer();
        if (badge) {
          badge.variant = 'social-row';
          const platforms: SocialPlatform[] = badge.platforms ? [...badge.platforms] : ['youtube', 'x', 'instagram'];
          const idx = platforms.indexOf(platform);
          if (idx >= 0) {
            if (platforms.length > 1) {
              platforms.splice(idx, 1);
            }
          } else {
            platforms.push(platform);
          }
          badge.platforms = platforms;
          this.syncSocialPlatformChips();
          this.applyChange({ layers: [...this.scene.layers] });
        }
      });
    });

    // 17. Fast Customizations: Curated Font Pairings
    const fontPairBtns = document.querySelectorAll<HTMLButtonElement>('.font-pair-btn');
    fontPairBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const titleFont = btn.getAttribute('data-font-title');
        const taglineFont = btn.getAttribute('data-font-tagline');
        const title = this.scene.layers.find((l) => l.type === 'text' && l.id === 'title') as TextLayer | undefined;
        if (title && titleFont) {
          title.font = titleFont;
        }
        const tagline = this.scene.layers.find((l) => l.type === 'text' && l.id === 'tagline') as TextLayer | undefined;
        if (tagline && taglineFont) {
          tagline.font = taglineFont;
        }
        this.applyChange({ layers: [...this.scene.layers] });
        this.showToast('Applied typography pairing');
      });
    });

    // 18. Fast Customizations: Quick Taglines
    const taglineChips = document.querySelectorAll<HTMLButtonElement>('.tagline-chip');
    taglineChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-tagline');
        if (text) {
          const tagline = this.scene.layers.find((l) => l.type === 'text' && l.id === 'tagline') as TextLayer | undefined;
          if (tagline) {
            tagline.text = text;
            const input = document.getElementById('layer-text-tagline') as HTMLInputElement | null;
            if (input) input.value = text;
            this.applyChange({ layers: [...this.scene.layers] });
            this.showToast('Tagline updated');
          }
        }
      });
    });

    // Initial render of text controls for current scene
    this.setupDeckSlider();
    this.setupMotionStudio();
    this.setupVariationControls();
    this.setupBadgeControls();
    this.renderTextLayerControls();
    this.syncBackgroundControls();
    this.syncPhotoFrameControls();
    this.syncShapeControls();
    this.syncBadgeControls();
  }

  public switchDeckTab(tabName: string): void {
    const tabBtns = document.querySelectorAll<HTMLButtonElement>('.deck-tab-btn');
    const slides = document.querySelectorAll<HTMLElement>('.deck-slide');

    tabBtns.forEach((b) => {
      const isSelected = b.getAttribute('data-deck-tab') === tabName;
      b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isSelected) {
        b.classList.remove('bg-transparent', 'text-ink-600', 'font-medium');
        b.classList.add('bg-surface-0', 'text-ink-950', 'shadow-xs', 'border', 'border-line-200', 'font-semibold');
      } else {
        b.classList.remove('bg-surface-0', 'text-ink-950', 'shadow-xs', 'border', 'border-line-200', 'font-semibold');
        b.classList.add('bg-transparent', 'text-ink-600', 'font-medium');
      }
    });

    slides.forEach((s) => {
      const matches = s.getAttribute('data-slide-id') === tabName;
      if (matches) {
        s.classList.remove('hidden');
      } else {
        s.classList.add('hidden');
      }
    });
  }

  private setupDeckSlider(): void {
    const tabBtns = document.querySelectorAll<HTMLButtonElement>('.deck-tab-btn');
    const navBtns = document.querySelectorAll<HTMLButtonElement>('[data-slide-nav]');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-deck-tab');
        if (tab) this.switchDeckTab(tab);
      });
    });

    navBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-slide-nav');
        if (target) this.switchDeckTab(target);
      });
    });
  }

  private setupMotionStudio(): void {
    if (this.motionToggleEl) {
      this.motionToggleEl.addEventListener('change', () => {
        if (this.motionToggleEl?.checked) {
          this.startMotion();
        } else {
          this.stopMotion();
        }
      });
    }

    if (this.motionSpeedSlider) {
      this.motionSpeedSlider.addEventListener('input', () => {
        this.motionSpeed = parseFloat(this.motionSpeedSlider!.value);
        if (this.motionSpeedValEl) {
          this.motionSpeedValEl.textContent = `${this.motionSpeed.toFixed(1)}x`;
        }
      });
    }

    if (this.motionIntensitySlider) {
      this.motionIntensitySlider.addEventListener('input', () => {
        const val = parseInt(this.motionIntensitySlider!.value, 10);
        this.motionIntensity = val / 100;
        if (this.motionIntensityValEl) {
          this.motionIntensityValEl.textContent = `${val}%`;
        }
      });
    }

    const presetBtns = document.querySelectorAll<HTMLButtonElement>('.motion-preset-btn');
    presetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-motion');
        if (!preset) return;
        this.activeMotionPreset = preset;
        presetBtns.forEach((b) => {
          b.classList.remove('border-accent', 'bg-accent/5', 'ring-1', 'ring-accent', 'active-motion-preset');
          b.classList.add('border-line-200', 'bg-surface-50');
        });
        btn.classList.remove('border-line-200', 'bg-surface-50');
        btn.classList.add('border-accent', 'bg-accent/5', 'ring-1', 'ring-accent', 'active-motion-preset');

        // Automatically start motion if not running
        if (!this.isMotionRunning) {
          if (this.motionToggleEl) this.motionToggleEl.checked = true;
          this.startMotion();
        }
      });
    });

    if (this.motionRecordVideoBtn) {
      this.motionRecordVideoBtn.addEventListener('click', () => {
        this.recordMotionVideo();
      });
    }

    if (this.motionCopyObsBtn) {
      this.motionCopyObsBtn.addEventListener('click', () => {
        this.copyObsCode();
      });
    }

    if (this.motionCopyCssBtn) {
      this.motionCopyCssBtn.addEventListener('click', () => {
        this.copyCssCode();
      });
    }
  }

  private startMotion(): void {
    if (!this.motionCanvasEl || !this.motionCtx) return;
    this.isMotionRunning = true;
    this.motionCanvasEl.classList.remove('opacity-0');
    this.motionCanvasEl.classList.add('opacity-100');

    if (this.motionParticles.length === 0) {
      for (let i = 0; i < 50; i++) {
        this.motionParticles.push({
          x: Math.random() * 2560,
          y: Math.random() * 1440,
          r: Math.random() * 3.5 + 1.5,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.8 + 0.3),
          alpha: Math.random() * 0.6 + 0.2,
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    this.motionLoop();
    this.showToast('Live 60 FPS motion activated');
  }

  private stopMotion(): void {
    this.isMotionRunning = false;
    if (this.motionCanvasEl) {
      this.motionCanvasEl.classList.remove('opacity-100');
      this.motionCanvasEl.classList.add('opacity-0');
    }
    if (this.motionAnimFrameId !== null) {
      cancelAnimationFrame(this.motionAnimFrameId);
      this.motionAnimFrameId = null;
    }
    if (this.motionCtx && this.motionCanvasEl) {
      this.motionCtx.clearRect(0, 0, this.motionCanvasEl.width, this.motionCanvasEl.height);
    }
  }

  private renderMotionFrame(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    ctx.clearRect(0, 0, w, h);
    const intensity = this.motionIntensity;
    const t = this.motionTime;

    if (this.activeMotionPreset === 'neon-pulse') {
      const pulse = Math.sin(t * 3) * 0.3 + 0.7;
      const glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.46, 20, w * 0.5, h * 0.46, 420);
      glowGrad.addColorStop(0, `rgba(138, 164, 255, ${0.35 * intensity * pulse})`);
      glowGrad.addColorStop(0.5, `rgba(147, 51, 234, ${0.18 * intensity * pulse})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(w * 0.2, h * 0.3, w * 0.6, h * 0.4);

      const scanY = (t * 180) % h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, 'rgba(138, 164, 255, 0)');
      scanGrad.addColorStop(0.5, `rgba(138, 164, 255, ${0.45 * intensity})`);
      scanGrad.addColorStop(1, 'rgba(138, 164, 255, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, w, 60);

      ctx.lineWidth = 2;
      ctx.strokeStyle = `rgba(138, 164, 255, ${0.7 * intensity * pulse})`;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.353);
      ctx.lineTo(w * 0.8, h * 0.353);
      ctx.moveTo(w * 0.2, h * 0.647);
      ctx.lineTo(w * 0.8, h * 0.647);
      ctx.stroke();

    } else if (this.activeMotionPreset === 'lofi-drift') {
      for (const p of this.motionParticles) {
        p.y += p.vy * this.motionSpeed;
        p.x += p.vx * this.motionSpeed + Math.sin(t + p.pulse) * 0.3;
        if (p.y < -20) p.y = h + 20;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;

        const pAlpha = p.alpha * intensity * (Math.sin(t * 2 + p.pulse) * 0.3 + 0.7);
        const pGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2);
        pGrad.addColorStop(0, `rgba(255, 230, 180, ${pAlpha})`);
        pGrad.addColorStop(0.6, `rgba(200, 160, 255, ${pAlpha * 0.5})`);
        pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2, 0, Math.PI * 2);
        ctx.fill();
      }

    } else if (this.activeMotionPreset === 'audio-wave') {
      const numBars = 36;
      const safeLeft = w * 0.22;
      const safeRight = w * 0.78;
      const totalWidth = safeRight - safeLeft;
      const barWidth = totalWidth / numBars - 4;
      const baseY = h * 0.64;

      for (let i = 0; i < numBars; i++) {
        const x = safeLeft + i * (barWidth + 4);
        const freq = Math.sin(t * 5 + i * 0.35) * Math.cos(t * 3 + i * 0.2);
        const barHeight = (Math.abs(freq) * 75 + 10) * intensity;

        const barGrad = ctx.createLinearGradient(0, baseY, 0, baseY - barHeight);
        barGrad.addColorStop(0, `rgba(35, 64, 184, ${0.8 * intensity})`);
        barGrad.addColorStop(1, `rgba(96, 165, 250, ${0.95 * intensity})`);

        ctx.fillStyle = barGrad;
        ctx.fillRect(x, baseY - barHeight, barWidth, barHeight);

        ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * intensity})`;
        ctx.fillRect(x, baseY - barHeight - 4, barWidth, 2);
      }

    } else if (this.activeMotionPreset === 'cinema-flare') {
      const flareX = (Math.sin(t * 0.6) * 0.25 + 0.5) * w;
      const flareY = h * 0.48;

      const streakGrad = ctx.createLinearGradient(0, flareY, w, flareY);
      streakGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      streakGrad.addColorStop(Math.max(0, flareX / w - 0.25), `rgba(253, 230, 138, ${0.2 * intensity})`);
      streakGrad.addColorStop(flareX / w, `rgba(255, 255, 255, ${0.95 * intensity})`);
      streakGrad.addColorStop(Math.min(1, flareX / w + 0.25), `rgba(96, 165, 250, ${0.2 * intensity})`);
      streakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = streakGrad;
      ctx.fillRect(0, flareY - 3, w, 6);

      const glintGrad = ctx.createRadialGradient(flareX, flareY, 0, flareX, flareY, 120 * intensity);
      glintGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * intensity})`);
      glintGrad.addColorStop(0.3, `rgba(253, 230, 138, ${0.45 * intensity})`);
      glintGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glintGrad;
      ctx.beginPath();
      ctx.arc(flareX, flareY, 120 * intensity, 0, Math.PI * 2);
      ctx.fill();

    } else if (this.activeMotionPreset === 'esports-hud') {
      const cx = w * 0.5;
      const cy = h * 0.5;
      const radius = 240;
      const angle = (t * 2.5) % (Math.PI * 2);

      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(255, 152, 0, ${0.4 * intensity})`;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      const sweepGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      sweepGrad.addColorStop(0, `rgba(255, 152, 0, ${0.5 * intensity})`);
      sweepGrad.addColorStop(1, `rgba(255, 152, 0, ${0.1 * intensity})`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle, angle + 0.4);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();
      ctx.restore();

      const blips = [
        { dist: radius * 0.7, a: 1.2 },
        { dist: radius * 0.4, a: 3.8 },
        { dist: radius * 0.85, a: 5.1 },
      ];
      for (const b of blips) {
        const bx = cx + Math.cos(b.a) * b.dist;
        const by = cy + Math.sin(b.a) * b.dist;
        const diff = (angle - b.a + Math.PI * 2) % (Math.PI * 2);
        const blink = diff < 1.0 ? 1 - diff : 0.2;

        ctx.fillStyle = `rgba(255, 87, 34, ${blink * intensity})`;
        ctx.beginPath();
        ctx.arc(bx, by, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private motionLoop(): void {
    if (!this.isMotionRunning || !this.motionCanvasEl || !this.motionCtx) return;
    this.motionTime += 0.016 * this.motionSpeed;
    this.renderMotionFrame(this.motionCtx, this.motionCanvasEl.width, this.motionCanvasEl.height);
    this.motionAnimFrameId = requestAnimationFrame(() => this.motionLoop());
  }

  private async recordMotionVideo(): Promise<void> {
    if (this.isRecordingVideo) return;
    this.isRecordingVideo = true;

    if (!this.motionRecordVideoBtn) return;
    const originalText = this.motionRecordVideoBtn.innerHTML;
    this.motionRecordVideoBtn.innerHTML = '<span>⏳ Recording 60 FPS Video (5s)...</span>';
    this.showToast('Recording 60 FPS WebM video loop...');

    try {
      const recCanvas = document.createElement('canvas');
      recCanvas.width = CANVAS.width;
      recCanvas.height = CANVAS.height;
      const recCtx = recCanvas.getContext('2d');

      if (!recCtx || typeof (recCanvas as any).captureStream !== 'function') {
        throw new Error('Canvas video capture is not supported in this browser.');
      }

      const stream = (recCanvas as any).captureStream(60);
      let mimeType = 'video/webm;codecs=vp9';
      if (typeof MediaRecorder !== 'undefined' && !MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 12000000 });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const durationMs = 5000;
      const startTime = performance.now();
      let animId: number;

      const recordFrame = () => {
        renderScene(recCtx, this.scene, this.images);
        this.renderMotionFrame(recCtx, recCanvas.width, recCanvas.height);

        if (performance.now() - startTime < durationMs) {
          animId = requestAnimationFrame(recordFrame);
        } else {
          cancelAnimationFrame(animId);
          recorder.stop();
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `youtube-banner-${this.activeMotionPreset}-60fps.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.isRecordingVideo = false;
        if (this.motionRecordVideoBtn) {
          this.motionRecordVideoBtn.innerHTML = originalText;
        }
        this.showToast('60 FPS animated banner exported!');
      };

      recorder.start();
      animId = requestAnimationFrame(recordFrame);

    } catch (err: any) {
      this.isRecordingVideo = false;
      if (this.motionRecordVideoBtn) {
        this.motionRecordVideoBtn.innerHTML = originalText;
      }
      this.showToast(`Recording failed: ${err.message || 'Unsupported browser'}`);
    }
  }

  private copyObsCode(): void {
    const titleLayer = this.scene.layers.find((l) => l.type === 'text' && (l as TextLayer).id === 'title') as TextLayer | undefined;
    const taglineLayer = this.scene.layers.find((l) => l.type === 'text' && (l as TextLayer).id === 'tagline') as TextLayer | undefined;
    const titleText = titleLayer?.text || 'CHANNEL NAME';
    const taglineText = taglineLayer?.text || 'New Videos Every Week';

    const obsHtml = `<!-- OBS Browser Source (2560x1440, 60 FPS) -->
<div style="width:2560px;height:1440px;position:relative;overflow:hidden;background:#0C0D0E;font-family:system-ui,sans-serif;">
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;width:1546px;height:423px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1 style="color:#FFFFFF;font-size:64px;margin:0;font-weight:900;letter-spacing:4px;text-shadow:0 0 30px #8AA4FF;">${titleText}</h1>
    <p style="color:#8AA4FF;font-size:24px;margin:16px 0 0;font-weight:600;letter-spacing:2px;">${taglineText}</p>
  </div>
  <style>
    @keyframes neonGlow { 0%,100%{filter:drop-shadow(0 0 20px #8AA4FF);} 50%{filter:drop-shadow(0 0 50px #8AA4FF);} }
    h1 { animation: neonGlow 2s ease-in-out infinite; }
  </style>
</div>`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(obsHtml).then(() => {
        this.showToast('OBS Browser Source snippet copied!');
      });
    } else {
      this.showToast('Clipboard access unavailable');
    }
  }

  private copyCssCode(): void {
    const cssCode = `/* Ready-to-Integrate Channel Banner Animation */
@keyframes ybmNeonPulse {
  0%, 100% {
    text-shadow: 0 0 10px rgba(138, 164, 255, 0.4), 0 0 30px rgba(138, 164, 255, 0.2);
    transform: scale(1);
  }
  50% {
    text-shadow: 0 0 25px rgba(138, 164, 255, 0.8), 0 0 60px rgba(147, 51, 234, 0.5);
    transform: scale(1.015);
  }
}

.ybm-channel-title {
  animation: ybmNeonPulse 2.4s ease-in-out infinite;
  will-change: transform, text-shadow;
}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cssCode).then(() => {
        this.showToast('CSS animation keyframes copied!');
      });
    } else {
      this.showToast('Clipboard access unavailable');
    }
  }

  private loadTemplate(tmpl: TemplateManifest): void {
    this.currentTemplateId = tmpl.id;
    this.currentTemplateManifest = tmpl;
    this.scene = templateToScene(tmpl);

    trackEvent('template_selected', { templateId: tmpl.id });

    if (this.currentTemplateNameEl) {
      this.currentTemplateNameEl.textContent = tmpl.name;
    }
    if (this.currentTemplateNicheEl) {
      this.currentTemplateNicheEl.textContent = tmpl.niche;
    }

    // Preload all frame photos if defined
    const frames = this.scene.layers.filter((l) => l.type === 'frame' && l.src) as PhotoFrameLayer[];
    for (const frame of frames) {
      if (frame.src && !this.images.has(frame.src)) {
        const fImg = new Image();
        fImg.onload = () => {
          this.images.set(frame.src!, fImg);
          this.scheduleFrame();
        };
        fImg.src = frame.src;
        if (fImg.complete && fImg.naturalWidth > 0) {
          this.images.set(frame.src, fImg);
          this.scheduleFrame();
        }
      }
    }

    // Preload background image if defined
    if (this.scene.background.type === 'image' && this.scene.background.src && !this.images.has(this.scene.background.src)) {
      const bgSrc = this.scene.background.src;
      const bgImg = new Image();
      bgImg.onload = () => {
        this.images.set(bgSrc, bgImg);
        this.scheduleFrame();
      };
      bgImg.src = bgSrc;
    }

    this.renderTextLayerControls();
    this.syncBackgroundControls();
    this.syncPhotoFrameControls();
    this.syncShapeControls();
    this.syncBadgeControls();
    this.applyChange({});
  }

  private loadBlank(): void {
    this.currentTemplateId = null;
    this.currentTemplateManifest = null;
    this.scene = defaultScene();

    if (this.currentTemplateNameEl) {
      this.currentTemplateNameEl.textContent = 'Blank Canvas';
    }
    if (this.currentTemplateNicheEl) {
      this.currentTemplateNicheEl.textContent = 'Custom';
    }

    this.renderTextLayerControls();
    this.syncBackgroundControls();
    this.syncPhotoFrameControls();
    this.syncShapeControls();
    this.syncBadgeControls();
    this.applyChange({});
  }

  private renderTextLayerControls(): void {
    if (!this.textLayersContainerEl) return;
    this.textLayersContainerEl.innerHTML = '';

    // Filter to editable text layers only. Protected composition elements are strictly ABSENT!
    const editableLayers = this.scene.layers.filter((layer) => {
      if (layer.type !== 'text') return false;
      if (this.currentTemplateManifest) {
        if (this.currentTemplateManifest.protected.includes(layer.id)) return false;
        if (!this.currentTemplateManifest.editable.includes(layer.id)) return false;
      }
      return true;
    }) as TextLayer[];

    editableLayers.forEach((layer) => {
      const card = document.createElement('div');
      card.className = 'layer-control-card space-y-2.5 p-3 rounded-lg bg-surface-50 border border-line-200';
      card.setAttribute('data-layer-id', layer.id);

      const titleLabel =
        layer.id === 'title'
          ? 'Channel Title'
          : layer.id === 'tagline'
            ? 'Tagline / Subtitle'
            : layer.id;

      card.innerHTML = `
        <div class="flex items-center justify-between text-xs font-medium text-ink-950">
          <span>${titleLabel}</span>
          <span class="text-[10px] font-mono text-ink-500">Safe-Area Bound</span>
        </div>

        <div>
          <label for="layer-text-${layer.id}" class="sr-only">${titleLabel} Text</label>
          <input
            type="text"
            id="layer-text-${layer.id}"
            class="layer-text-input w-full min-h-[44px] px-3 py-2 text-xs rounded-md border border-line-200 bg-surface-0 text-ink-950 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
            value="${layer.text.replace(/"/g, '&quot;')}"
            data-layer-id="${layer.id}"
            placeholder="Enter text..."
          />
        </div>

        <div class="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label for="layer-color-${layer.id}" class="block text-[11px] text-ink-600 mb-1">Color</label>
            <div class="flex items-center gap-2">
              <input
                type="color"
                id="layer-color-${layer.id}"
                class="layer-color-input w-9 h-9 min-h-[44px] min-w-[44px] rounded border border-line-200 cursor-pointer p-0.5 bg-surface-0"
                value="${layer.color}"
                data-layer-id="${layer.id}"
                aria-label="${titleLabel} color"
              />
              <span class="layer-color-hex text-[11px] font-mono text-ink-600">${layer.color}</span>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-[11px] text-ink-600 mb-1">
              <label for="layer-size-${layer.id}">Size</label>
              <span class="layer-size-val font-mono text-[10px] text-ink-500">${layer.size}px</span>
            </div>
            <input
              type="range"
              id="layer-size-${layer.id}"
              min="16"
              max="96"
              value="${layer.size}"
              class="layer-size-slider w-full h-3 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-ink-950"
              data-layer-id="${layer.id}"
              aria-label="${titleLabel} font size"
            />
          </div>
        </div>

        <div class="pt-1 flex items-center justify-between">
          <span class="text-[11px] text-ink-600">Alignment</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="layer-align-btn min-h-[44px] min-w-[44px] p-2 rounded-xl border border-line-200 ${
                layer.align === 'left' ? 'bg-ink-950 text-surface-0 active-align' : 'bg-surface-0 hover:bg-surface-100 text-ink-800'
              } text-xs flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-accent"
              data-layer-id="${layer.id}"
              data-align="left"
              aria-label="Align left"
            >
              ◀
            </button>
            <button
              type="button"
              class="layer-align-btn min-h-[44px] min-w-[44px] p-2 rounded-xl border border-line-200 ${
                layer.align === 'center' ? 'bg-ink-950 text-surface-0 active-align' : 'bg-surface-0 hover:bg-surface-100 text-ink-800'
              } text-xs flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-accent"
              data-layer-id="${layer.id}"
              data-align="center"
              aria-label="Align center"
            >
              ■
            </button>
            <button
              type="button"
              class="layer-align-btn min-h-[44px] min-w-[44px] p-2 rounded-xl border border-line-200 ${
                layer.align === 'right' ? 'bg-ink-950 text-surface-0 active-align' : 'bg-surface-0 hover:bg-surface-100 text-ink-800'
              } text-xs flex items-center justify-center cursor-pointer active:scale-[0.98] transition-all focus-visible:ring-2 focus-visible:ring-accent"
              data-layer-id="${layer.id}"
              data-align="right"
              aria-label="Align right"
            >
              ▶
            </button>
          </div>
        </div>
      `;

      // Wire inputs
      const textInput = card.querySelector<HTMLInputElement>('.layer-text-input');
      const sizeInput = card.querySelector<HTMLInputElement>('.layer-size-slider');
      const sizeSpan = card.querySelector<HTMLElement>('.layer-size-val');

      textInput?.addEventListener('input', () => {
        layer.text = textInput.value;
        if (layer.id === 'title') {
          this.autoFitTitleSize(layer, sizeInput, sizeSpan);
        }
        this.applyChange({ layers: [...this.scene.layers] });
      });

      const colorInput = card.querySelector<HTMLInputElement>('.layer-color-input');
      const hexSpan = card.querySelector<HTMLElement>('.layer-color-hex');
      colorInput?.addEventListener('input', () => {
        layer.color = colorInput.value;
        if (hexSpan) hexSpan.textContent = colorInput.value;
        this.applyChange({ layers: [...this.scene.layers] });
      });

      sizeInput?.addEventListener('input', () => {
        const val = parseInt(sizeInput.value, 10);
        layer.size = val;
        if (sizeSpan) sizeSpan.textContent = `${val}px`;
        this.applyChange({ layers: [...this.scene.layers] });
      });

      const alignBtns = card.querySelectorAll<HTMLButtonElement>('.layer-align-btn');
      alignBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const align = btn.getAttribute('data-align') as 'left' | 'center' | 'right';
          layer.align = align;
          alignBtns.forEach((b) => {
            b.classList.remove('bg-ink-950', 'text-surface-0', 'active-align');
            b.classList.add('bg-surface-0', 'text-ink-800');
          });
          btn.classList.add('bg-ink-950', 'text-surface-0', 'active-align');
          btn.classList.remove('bg-surface-0', 'text-ink-800');
          this.applyChange({ layers: [...this.scene.layers] });
        });
      });

      this.textLayersContainerEl!.appendChild(card);
    });
  }

  private syncBackgroundControls(): void {
    const bg = this.scene.background;
    if (bg.type === 'gradient') {
      this.activateBgType('gradient');
      if (this.bgGradientFromInput) this.bgGradientFromInput.value = bg.from;
      if (this.bgGradientFromHexEl) this.bgGradientFromHexEl.textContent = bg.from;
      if (this.bgGradientToInput) this.bgGradientToInput.value = bg.to;
      if (this.bgGradientToHexEl) this.bgGradientToHexEl.textContent = bg.to;
      if (this.bgGradientAngleInput) this.bgGradientAngleInput.value = String(bg.angle);
      if (this.bgGradientAngleValEl) this.bgGradientAngleValEl.textContent = `${bg.angle}°`;
      this.makePhotoRepositionWrap?.classList.add('hidden');
    } else if (bg.type === 'solid') {
      this.activateBgType('solid');
      if (this.bgSolidColorInput) this.bgSolidColorInput.value = bg.color;
      if (this.bgSolidColorHexEl) this.bgSolidColorHexEl.textContent = bg.color;
      this.makePhotoRepositionWrap?.classList.add('hidden');
    } else if (bg.type === 'image') {
      this.activateBgType('photo');
      this.makePhotoRepositionWrap?.classList.remove('hidden');
    }
  }

  private syncMakeControlsFromScene(): void {
    if (this.mode !== 'make') return;
    this.renderTextLayerControls();
    this.syncBackgroundControls();
    this.syncPhotoFrameControls();
    this.syncShapeControls();
    this.syncBadgeControls();
  }

  private getPhotoFrameLayer(): PhotoFrameLayer | undefined {
    return this.scene.layers.find((l) => l.type === 'frame') as PhotoFrameLayer | undefined;
  }

  private getShapeLayers(): ShapeLayer[] {
    return this.scene.layers.filter((l) => l.type === 'shape') as ShapeLayer[];
  }

  private applySafeSnap(snap: string | null): void {
    const frame = this.getPhotoFrameLayer();
    const title = this.scene.layers.find((l) => l.type === 'text' && l.id === 'title') as TextLayer | undefined;
    const tagline = this.scene.layers.find((l) => l.type === 'text' && l.id === 'tagline') as TextLayer | undefined;
    const badge = this.getBadgeLayer();
    const shapes = this.getShapeLayers();

    if (snap === 'center') {
      if (frame) {
        frame.x = 0.50;
        frame.y = 0.40;
      }
      if (title) {
        title.position.x = 0.50;
        title.position.y = frame ? 0.52 : 0.46;
        title.align = 'center';
      }
      if (tagline) {
        tagline.position.x = 0.50;
        tagline.position.y = frame ? 0.60 : 0.54;
        tagline.align = 'center';
      }
      if (badge) {
        badge.x = 0.50;
        badge.y = 0.62;
      }
      if (shapes.length > 0 && shapes[0].shape === 'rect') {
        shapes[0].x = 0.50;
      }
      this.showToast('Snapped to True Center');
    } else if (snap === 'split-left') {
      if (frame) {
        frame.x = 0.28;
        frame.y = 0.50;
      }
      if (title) {
        title.position.x = frame ? 0.46 : 0.35;
        title.position.y = 0.46;
        title.align = 'left';
      }
      if (tagline) {
        tagline.position.x = frame ? 0.46 : 0.35;
        tagline.position.y = 0.54;
        tagline.align = 'left';
      }
      if (badge) {
        badge.x = frame ? 0.46 : 0.35;
        badge.y = 0.62;
      }
      if (shapes.length > 0 && shapes[0].shape === 'rect') {
        shapes[0].x = frame ? 0.46 : 0.35;
      }
      this.showToast('Snapped to Split-Left');
    } else if (snap === 'split-right') {
      if (frame) {
        frame.x = 0.72;
        frame.y = 0.50;
      }
      if (title) {
        title.position.x = 0.28;
        title.position.y = 0.46;
        title.align = 'left';
      }
      if (tagline) {
        tagline.position.x = 0.28;
        tagline.position.y = 0.54;
        tagline.align = 'left';
      }
      if (badge) {
        badge.x = 0.28;
        badge.y = 0.62;
      }
      if (shapes.length > 0 && shapes[0].shape === 'rect') {
        shapes[0].x = 0.28;
      }
      this.showToast('Snapped to Split-Right');
    } else if (snap === 'stacked') {
      if (frame) {
        frame.x = 0.50;
        frame.y = 0.36;
      }
      if (title) {
        title.position.x = 0.50;
        title.position.y = frame ? 0.48 : 0.46;
        title.align = 'center';
      }
      if (tagline) {
        tagline.position.x = 0.50;
        tagline.position.y = frame ? 0.56 : 0.54;
        tagline.align = 'center';
      }
      if (badge) {
        badge.x = 0.50;
        badge.y = 0.63;
      }
      if (shapes.length > 0 && shapes[0].shape === 'rect') {
        shapes[0].x = 0.50;
      }
      this.showToast('Snapped to Stacked Layout');
    }

    this.applyChange({ layers: [...this.scene.layers] });
    this.renderTextLayerControls();
    this.syncPhotoFrameControls();
  }

  private syncSocialPlatformChips(): void {
    const badge = this.getBadgeLayer();
    const activePlatforms = (badge?.variant === 'social-row' && badge.platforms) || ['youtube', 'x', 'instagram'];
    const socialChips = document.querySelectorAll<HTMLButtonElement>('.social-platform-chip');
    socialChips.forEach((chip) => {
      const p = chip.getAttribute('data-platform') as SocialPlatform;
      if (activePlatforms.includes(p)) {
        chip.classList.add('bg-accent', 'text-white', 'border-accent');
        chip.classList.remove('bg-surface-50', 'text-ink-700');
      } else {
        chip.classList.remove('bg-accent', 'text-white', 'border-accent');
        chip.classList.add('bg-surface-50', 'text-ink-700');
      }
    });
  }

  private syncPhotoFrameControls(): void {
    if (this.mode !== 'make') return;
    const frame = this.getPhotoFrameLayer();
    if (frame) {
      this.frameControlsActiveEl?.classList.remove('hidden');
      this.frameControlsInactiveEl?.classList.add('hidden');
      if (this.frameStatusBadgeEl) {
        this.frameStatusBadgeEl.textContent = frame.src ? 'Active' : 'Empty';
      }
      if (this.frameUploadBtnLabel) {
        this.frameUploadBtnLabel.textContent = frame.src ? 'Replace Photo' : 'Upload Photo / Headshot';
      }

      if (frame.shape === 'rect') {
        this.frameShapeRectBtn?.classList.remove('bg-surface-50', 'text-ink-700');
        this.frameShapeRectBtn?.classList.add('bg-ink-950', 'text-surface-0');
        this.frameShapeCircleBtn?.classList.remove('bg-ink-950', 'text-surface-0');
        this.frameShapeCircleBtn?.classList.add('bg-surface-50', 'text-ink-700');
      } else {
        this.frameShapeCircleBtn?.classList.remove('bg-surface-50', 'text-ink-700');
        this.frameShapeCircleBtn?.classList.add('bg-ink-950', 'text-surface-0');
        this.frameShapeRectBtn?.classList.remove('bg-ink-950', 'text-surface-0');
        this.frameShapeRectBtn?.classList.add('bg-surface-50', 'text-ink-700');
      }

      if (this.frameZoomSlider) this.frameZoomSlider.value = String(frame.zoom ?? 1.0);
      if (this.frameZoomValEl) this.frameZoomValEl.textContent = `${(frame.zoom ?? 1.0).toFixed(1)}×`;

      const borderColor = frame.borderColor || '#FFFFFF';
      if (this.frameBorderColorInput) this.frameBorderColorInput.value = borderColor;
      if (this.frameBorderColorHexEl) this.frameBorderColorHexEl.textContent = borderColor;

      const borderWidth = frame.borderWidth ?? 3;
      if (this.frameBorderWidthInput) this.frameBorderWidthInput.value = String(borderWidth);
      if (this.frameBorderWidthValEl) this.frameBorderWidthValEl.textContent = `${borderWidth}px`;
    } else {
      this.frameControlsActiveEl?.classList.add('hidden');
      this.frameControlsInactiveEl?.classList.remove('hidden');
      if (this.frameStatusBadgeEl) {
        this.frameStatusBadgeEl.textContent = 'None';
      }
    }
  }

  private syncShapeControls(): void {
    if (this.mode !== 'make') return;
    const shapes = this.getShapeLayers();
    if (shapes.length > 0) {
      this.shapeActiveControlsEl?.classList.remove('hidden');
      if (this.shapeStatusBadgeEl) {
        this.shapeStatusBadgeEl.textContent = `${shapes.length} Active`;
        this.shapeStatusBadgeEl.classList.remove('bg-surface-100', 'text-ink-600');
        this.shapeStatusBadgeEl.classList.add('bg-accent/10', 'text-accent', 'border-accent/20');
      }
      if (this.shapeLayerLabelEl) {
        this.shapeLayerLabelEl.textContent = `${shapes.length} shape layer${shapes.length > 1 ? 's' : ''} on canvas`;
      }
      const activeShape = shapes[shapes.length - 1];
      if (this.shapeColorInput) this.shapeColorInput.value = activeShape.color;
      if (this.shapeColorHexEl) this.shapeColorHexEl.textContent = activeShape.color;
      if (this.shapeOpacitySlider) this.shapeOpacitySlider.value = String(activeShape.opacity ?? 1);
      if (this.shapeOpacityValEl) this.shapeOpacityValEl.textContent = `${Math.round((activeShape.opacity ?? 1) * 100)}%`;
    } else {
      this.shapeActiveControlsEl?.classList.add('hidden');
      if (this.shapeStatusBadgeEl) {
        this.shapeStatusBadgeEl.textContent = 'None';
        this.shapeStatusBadgeEl.classList.add('bg-surface-100', 'text-ink-600');
        this.shapeStatusBadgeEl.classList.remove('bg-accent/10', 'text-accent', 'border-accent/20');
      }
    }
  }

  private autoFitTitleSize(
    layer: TextLayer,
    sizeInput: HTMLInputElement | null,
    sizeSpan: HTMLElement | null
  ): void {
    if (!layer.text) return;
    const maxSafeWidth = 1100;
    let currentWidth = measureTextWidth(layer.text, layer.font, layer.size);
    if (currentWidth > maxSafeWidth && layer.size > 24) {
      while (currentWidth > maxSafeWidth && layer.size > 24) {
        layer.size -= 2;
        currentWidth = measureTextWidth(layer.text, layer.font, layer.size);
      }
      if (sizeInput) sizeInput.value = String(layer.size);
      if (sizeSpan) sizeSpan.textContent = `${layer.size}px`;
    }
  }

  private getBadgeLayer(): BadgeLayer | undefined {
    return this.scene.layers.find((l) => l.type === 'badge') as BadgeLayer | undefined;
  }

  private syncBadgeControls(): void {
    if (this.mode !== 'make') return;
    const badge = this.getBadgeLayer();
    const configPanel = document.getElementById('badge-config-panel');
    const customTextInput = document.getElementById('badge-custom-text') as HTMLInputElement | null;
    const badgeBtns = document.querySelectorAll<HTMLButtonElement>('.badge-toggle-btn');
    const schemeBtns = document.querySelectorAll<HTMLButtonElement>('.badge-scheme-btn');

    if (badge) {
      configPanel?.classList.remove('hidden');
      if (customTextInput && customTextInput.value !== badge.text) {
        customTextInput.value = badge.text || '';
      }

      const socialPanel = document.getElementById('social-platforms-panel');
      if (badge.variant === 'social-row') {
        socialPanel?.classList.remove('hidden');
        this.syncSocialPlatformChips();
      } else {
        socialPanel?.classList.add('hidden');
      }

      badgeBtns.forEach((b) => {
        const isMatch = b.getAttribute('data-badge-variant') === badge.variant;
        if (isMatch) {
          b.classList.add('ring-2', 'ring-accent', 'border-accent', 'bg-accent/10');
          b.classList.remove('bg-surface-0');
        } else {
          b.classList.remove('ring-2', 'ring-accent', 'border-accent', 'bg-accent/10');
          b.classList.add('bg-surface-0');
        }
      });

      schemeBtns.forEach((b) => {
        const isMatch = b.getAttribute('data-scheme') === (badge.colorScheme || 'youtube-red');
        if (isMatch) {
          b.classList.add('ring-2', 'ring-offset-1', 'ring-ink-950');
        } else {
          b.classList.remove('ring-2', 'ring-offset-1', 'ring-ink-950');
        }
      });
    } else {
      configPanel?.classList.add('hidden');
      document.getElementById('social-platforms-panel')?.classList.add('hidden');
      badgeBtns.forEach((b) => {
        b.classList.remove('ring-2', 'ring-accent', 'border-accent', 'bg-accent/10');
        b.classList.add('bg-surface-0');
      });
      schemeBtns.forEach((b) => {
        b.classList.remove('ring-2', 'ring-offset-1', 'ring-ink-950');
      });
    }
  }

  private toggleBadge(variant: BadgeLayer['variant']): void {
    const existing = this.getBadgeLayer();
    if (existing && existing.variant === variant) {
      this.removeBadge();
      return;
    }

    const defaultTexts: Record<BadgeLayer['variant'], string> = {
      'subscribe-pill': 'SUBSCRIBE',
      'subscribe-cookie': 'SUBSCRIBE FOR A COOKIE',
      'bell-pill': 'NOTIFICATIONS ON',
      'schedule-tag': 'NEW VIDEO EVERY WEEK',
      'social-row': '@channel',
      'verified-check': 'OFFICIAL',
    };

    if (existing) {
      existing.variant = variant;
      existing.text = defaultTexts[variant] || 'SUBSCRIBE';
    } else {
      const newBadge: BadgeLayer = {
        id: 'yt-badge',
        type: 'badge',
        variant,
        text: defaultTexts[variant] || 'SUBSCRIBE',
        colorScheme: 'youtube-red',
        x: 0.5,
        y: 0.58,
        scale: 1.0,
        safeAreaConstrained: true,
      };
      this.scene.layers.push(newBadge);
    }

    this.applyChange({ layers: [...this.scene.layers] });
    this.syncBadgeControls();
    this.showToast(`Badge updated: ${variant}`);
  }

  private removeBadge(): void {
    this.scene.layers = this.scene.layers.filter((l) => l.type !== 'badge');
    this.applyChange({ layers: [...this.scene.layers] });
    this.syncBadgeControls();
    this.showToast('Badge removed');
  }

  private setupVariationControls(): void {
    const variationBtns = document.querySelectorAll<HTMLButtonElement>('.variation-btn');
    variationBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const variation = btn.getAttribute('data-variation') as VariationType;
        if (!variation) return;

        let baseDs = this.scene.designSystem;
        if (variation === 'original' && this.currentTemplateManifest?.designSystem) {
          baseDs = this.currentTemplateManifest.designSystem;
        } else if (!baseDs) {
          const titleLayer = this.scene.layers.find((l) => l.type === 'text' && l.id === 'title') as TextLayer | undefined;
          const subLayer = this.scene.layers.find((l) => l.type === 'text' && l.id !== 'title') as TextLayer | undefined;
          const bgCol = this.scene.background.type === 'solid' ? this.scene.background.color : (this.scene.background.type === 'gradient' ? this.scene.background.from : '#0F172A');
          baseDs = {
            palette: {
              primary: titleLayer?.color || '#FFFFFF',
              secondary: subLayer?.color || '#9CA3AF',
              surface: bgCol,
              accent: '#2340B8',
            },
            typography: {
              titleFont: titleLayer?.font || 'Inter',
              taglineFont: subLayer?.font || 'Inter',
            },
          };
        }

        const newDs = computeVariation(baseDs, variation);
        this.scene = applyDesignSystemToScene(this.scene, newDs);

        variationBtns.forEach((b) => {
          b.classList.remove('ring-2', 'ring-accent', 'border-accent', 'bg-accent/5');
        });
        btn.classList.add('ring-2', 'ring-accent', 'border-accent', 'bg-accent/5');

        this.syncMakeControlsFromScene();
        this.applyChange({});
        this.showToast(`Applied ${variation} style variation`);
      });
    });
  }

  private setupBadgeControls(): void {
    const badgeToggleBtns = document.querySelectorAll<HTMLButtonElement>('.badge-toggle-btn');
    badgeToggleBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const variant = btn.getAttribute('data-badge-variant') as BadgeLayer['variant'];
        if (!variant) return;
        this.toggleBadge(variant);
      });
    });

    const badgeCustomInput = document.getElementById('badge-custom-text') as HTMLInputElement | null;
    badgeCustomInput?.addEventListener('input', () => {
      const badge = this.getBadgeLayer();
      if (badge) {
        badge.text = badgeCustomInput.value;
        this.applyChange({ layers: [...this.scene.layers] });
      }
    });

    const badgeSchemeBtns = document.querySelectorAll<HTMLButtonElement>('.badge-scheme-btn');
    badgeSchemeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const scheme = btn.getAttribute('data-scheme') as BadgeLayer['colorScheme'];
        if (!scheme) return;
        const badge = this.getBadgeLayer();
        if (badge) {
          badge.colorScheme = scheme;
          this.applyChange({ layers: [...this.scene.layers] });
          this.syncBadgeControls();
        }
      });
    });

    const badgeRemoveBtn = document.getElementById('badge-remove-btn');
    badgeRemoveBtn?.addEventListener('click', () => {
      this.removeBadge();
    });
  }

  private handleFramePhotoUpload(file: File): void {
    if (file.size > MAX_UPLOAD_BYTES) {
      this.showToast('Image exceeds 6 MB maximum limit');
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.showToast('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;
      const img = new Image();
      img.onload = () => {
        let frame = this.getPhotoFrameLayer();
        if (!frame) {
          frame = {
            id: 'avatar-frame',
            type: 'frame',
            shape: 'circle',
            x: 0.28,
            y: 0.50,
            w: 0.10,
            h: 0.1778,
            src: dataUrl,
            zoom: 1.0,
            offsetX: 0,
            offsetY: 0,
            borderWidth: 3,
            borderColor: '#FFFFFF',
            safeAreaConstrained: true,
          };
          this.scene.layers.push(frame);
        } else {
          frame.src = dataUrl;
          frame.zoom = 1.0;
          frame.offsetX = 0;
          frame.offsetY = 0;
        }
        this.images.set(dataUrl, img);
        this.applyChange({ layers: [...this.scene.layers] });
        this.syncPhotoFrameControls();
        this.showToast('Photo placed in frame');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  private activateBgType(type: 'gradient' | 'solid' | 'photo'): void {
    const btns = [
      { type: 'gradient', btn: this.bgTypeGradientBtn, panel: this.bgGradientControlsEl },
      { type: 'solid', btn: this.bgTypeSolidBtn, panel: this.bgSolidControlsEl },
      { type: 'photo', btn: this.bgTypePhotoBtn, panel: this.bgPhotoControlsEl },
    ];

    btns.forEach((b) => {
      if (b.type === type) {
        b.btn?.classList.add('bg-ink-950', 'text-surface-0');
        b.btn?.classList.remove('bg-transparent', 'text-ink-700');
        b.panel?.classList.remove('hidden');
      } else {
        b.btn?.classList.remove('bg-ink-950', 'text-surface-0');
        b.btn?.classList.add('bg-transparent', 'text-ink-700');
        b.panel?.classList.add('hidden');
      }
    });
  }

  private checkNonSrgb(file: File): void {
    try {
      const slice = file.slice(0, 65536);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          if (reader.result instanceof ArrayBuffer) {
            const bytes = new Uint8Array(reader.result);
            let str = '';
            for (let i = 0; i < bytes.length; i++) {
              const c = bytes[i];
              str += c >= 32 && c <= 126 ? String.fromCharCode(c) : ' ';
            }
            const nonSrgbKeywords = ['Display P3', 'DCI-P3', 'Adobe RGB', 'ProPhoto', 'Wide Gamut'];
            const isNon = nonSrgbKeywords.some((kw) => str.includes(kw));
            if (isNon !== this.isNonSrgb) {
              this.isNonSrgb = isNon;
              if (this.mode === 'check') {
                this.validate();
              }
            }
          }
        } catch {
          // ignore error
        }
      };
      reader.readAsArrayBuffer(slice);
    } catch {
      // ignore
    }
  }

  private handleMakePhotoUpload(file: File): void {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.showFileError(
        'Unsupported image format',
        `File is "${file.type || 'unknown'}". YouTube requires standard PNG, JPEG, or WebP format.`
      );
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      this.showFileError(
        'File size exceeds 6 MB',
        `Your image is ${mb} MB. YouTube Studio rejects banner uploads above 6 MB. Please compress or choose a smaller file.`
      );
      return;
    }

    this.checkNonSrgb(file);

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.sourceDataUrl = dataUrl;
      this.sourceFileSize = file.size;

      trackEvent('upload', {
        format: cleanImageFormat(file.type),
        sizeTier: getSizeTier(file.size),
      });

      this.loadImageFromDataUrl(dataUrl, () => {
        const img = this.currentImageElement;
        this.scene.background = {
          type: 'image',
          src: 'user-bg',
          width: img?.naturalWidth || CANVAS.width,
          height: img?.naturalHeight || CANVAS.height,
          cover: true,
          offsetX: 0,
          offsetY: 0,
          zoom: 1.0,
          extend: false,
        };
        this.activateBgType('photo');
        this.makePhotoRepositionWrap?.classList.remove('hidden');
        this.updateZoomControlsRange();
        this.applyChange({ background: this.scene.background });
      });
    };
    reader.readAsDataURL(file);
  }

  /**
   * File upload processing with 6 MB cap check (REQ-002, REQ-027)
   */
  private handleFileUpload(file: File): void {
    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      this.showFileError(
        'Unsupported image format',
        `File is "${file.type || 'unknown'}". YouTube requires standard PNG, JPEG, or WebP format.`
      );
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      const mb = (file.size / (1024 * 1024)).toFixed(1);
      this.showFileError(
        'File size exceeds 6 MB',
        `Your image is ${mb} MB. YouTube Studio rejects banner uploads above 6 MB. Please compress or choose a smaller file.`
      );
      return;
    }

    this.checkNonSrgb(file);

    this.sourceFileSize = file.size;

    trackEvent('upload', {
      format: cleanImageFormat(file.type),
      sizeTier: getSizeTier(file.size),
    });

    // Below 3 MB: read dataUrl for sessionStorage preservation (D-10)
    // Above 3 MB: use URL.createObjectURL for memory efficiency, then revoke
    if (file.size <= 3 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        this.sourceDataUrl = dataUrl;
        this.finishImageLoad(dataUrl);
      };
      reader.onerror = () => {
        this.showFileError('Read error', 'Could not read the selected image file. Please try another image.');
      };
      reader.readAsDataURL(file);
    } else {
      this.sourceDataUrl = null;
      const blobUrl = URL.createObjectURL(file);
      this.finishImageLoad(blobUrl, () => URL.revokeObjectURL(blobUrl));
    }
  }

  private finishImageLoad(srcUrl: string, onDone?: () => void): void {
    this.loadImageFromDataUrl(
      srcUrl,
      () => {
        if (onDone) onDone();
        // Preserve user's offset/zoom settings if re-uploading from NEEDS_SOURCE
        let existingX = 0;
        let existingY = 0;
        let existingZoom = 1;
        let existingExtend = false;

        if (this.scene.background.type === 'image') {
          existingX = this.scene.background.offsetX;
          existingY = this.scene.background.offsetY;
          existingZoom = this.scene.background.zoom;
          existingExtend = this.scene.background.extend;
        }

        this.phase = 'READY';
        this.updatePhaseUI();

        // Initialize scene background with cover fit
        const bg: Background = {
          type: 'image',
          src: 'user-bg',
          width: this.sourceDimensions.w,
          height: this.sourceDimensions.h,
          cover: true,
          offsetX: existingX,
          offsetY: existingY,
          zoom: existingZoom,
          extend: existingExtend,
        };

        this.applyChange({ background: bg });
        this.updateZoomControlsRange();
      },
      () => {
        if (onDone) onDone();
        this.showFileError(
          'Image decoding failure',
          'The uploaded file could not be parsed as a valid image. Please verify file integrity and re-upload.'
        );
      }
    );
  }

  private showFileError(title: string, detail: string): void {
    this.phase = 'ERROR';
    this.updatePhaseUI();

    if (this.verdictsContainerEl && this.verdictEmptyEl) {
      this.verdictEmptyEl.classList.add('hidden');
      this.verdictAllClearEl?.classList.add('hidden');
      this.verdictsContainerEl.innerHTML = '';

      const errBox = document.createElement('div');
      errBox.className = 'p-3 rounded-lg border border-danger/30 bg-danger/5 text-ink-950 text-xs flex items-start gap-2.5';
      errBox.innerHTML = `
        <span class="text-danger font-bold text-sm">✕</span>
        <div class="flex-1 space-y-1">
          <p class="font-semibold text-ink-950">${title}</p>
          <p class="text-[11px] text-ink-600">${detail}</p>
          <button type="button" class="mt-1 px-4 py-1.5 text-xs font-medium rounded-full bg-surface-0 border border-line-200 hover:bg-surface-50 active:scale-[0.98] transition-all cursor-pointer shadow-xs">
            Select another image
          </button>
        </div>
      `;
      const btn = errBox.querySelector('button');
      btn?.addEventListener('click', () => this.uploadInputEl?.click());
      this.verdictsContainerEl.appendChild(errBox);
    } else {
      let makeErr = document.getElementById('make-file-error');
      if (!makeErr && this.bgPhotoFileInput?.parentElement) {
        makeErr = document.createElement('div');
        makeErr.id = 'make-file-error';
        makeErr.className = 'mt-2 p-2.5 rounded-lg border border-danger/30 bg-danger/5 text-ink-950 text-xs flex items-start gap-2';
        this.bgPhotoFileInput.parentElement.appendChild(makeErr);
      }
      if (makeErr) {
        makeErr.innerHTML = `<span class="text-danger font-bold text-sm">✕</span><div><p class="font-semibold text-ink-950">${title}</p><p class="text-[11px] text-ink-600">${detail}</p></div>`;
      }
    }

    this.announceMessage(`${title}: ${detail}`);
  }

  /**
   * Decodes an image and tracks it in images map
   */
  private loadImageFromDataUrl(srcUrl: string, onLoaded: () => void, onError?: () => void): void {
    const img = new Image();
    img.onload = () => {
      this.currentImageElement = img;
      this.sourceDimensions = {
        w: img.naturalWidth || CANVAS.width,
        h: img.naturalHeight || CANVAS.height,
      };
      this.images.set('user-bg', img);
      this.images.set(srcUrl, img);
      onLoaded();
    };
    img.onerror = () => {
      if (onError) onError();
    };
    img.src = srcUrl;
  }

  /**
   * Single funnel for all scene mutations (Decision D-8)
   */
  private applyChange(patch: Partial<Scene>): void {
    this.scene = {
      ...this.scene,
      ...patch,
    };

    // Auto-clamp zoom and offset when background is an image
    if (this.scene.background.type === 'image' && this.currentImageElement) {
      const sw = this.sourceDimensions.w;
      const sh = this.sourceDimensions.h;
      const validZoom = clampZoom(this.scene.background.zoom, sw, sh);
      const scale = Math.max(CANVAS.width / sw, CANVAS.height / sh);
      const effScale = scale * validZoom;
      const drawW = sw * effScale;
      const drawH = sh * effScale;

      const clamped = clampOffset(
        this.scene.background.offsetX,
        this.scene.background.offsetY,
        drawW,
        drawH
      );

      this.scene.background.zoom = validZoom;
      this.scene.background.offsetX = clamped.x;
      this.scene.background.offsetY = clamped.y;

      // Sync zoom slider & badge
      if (this.zoomSlider) {
        this.zoomSlider.value = validZoom.toFixed(2);
      }
      if (this.zoomClampBadge) {
        this.zoomClampBadge.textContent = `${validZoom.toFixed(2)}×`;
      }
      const cap = Math.min(sw / CANVAS.width, sh / CANVAS.height);
      const maxZoom = Math.max(1, cap);
      if (this.zoomWarningEl) {
        if (validZoom >= maxZoom && maxZoom > 1) {
          this.zoomWarningEl.classList.remove('hidden');
          this.zoomWarningEl.textContent = '1:1 optical resolution ceiling';
        } else {
          this.zoomWarningEl.classList.add('hidden');
        }
      }
    }

    // Reset export anyway acknowledgement if scene changes
    if (this.exportAnywayAcknowledged) {
      this.exportAnywayAcknowledged = false;
      if (this.exportButtonText) {
        this.exportButtonText.textContent = clientI18n?.exportBtn?.downloadBanner || 'Download Banner';
      }
    }

    this.scheduleFrame();
    this.schedulePersist();
  }

  /**
   * Schedule rAF-coalesced render and validation
   */
  private scheduleFrame(): void {
    if (this.frameScheduled) return;
    this.frameScheduled = true;

    requestAnimationFrame(() => {
      this.frameScheduled = false;
      this.render();
      this.validate();
      if (this.simulateToggle && this.simulateToggle.checked) {
        this.runSimulation();
      }
    });
  }

  /**
   * Render editor canvas at display scale and update 4 device previews
   */
  private render(): void {
    if (!this.canvasEl || !this.ctx) return;

    // Display scale logic
    const rect = this.canvasEl.getBoundingClientRect();
    const displayWidth = Math.max(1, Math.round(rect.width * window.devicePixelRatio));
    const displayHeight = Math.max(1, Math.round(rect.height * window.devicePixelRatio));

    if (this.canvasEl.width !== displayWidth || this.canvasEl.height !== displayHeight) {
      this.canvasEl.width = displayWidth;
      this.canvasEl.height = displayHeight;
    }

    const displayScale = displayWidth / CANVAS.width;
    renderPreview(this.ctx, this.scene, this.images, displayScale);

    // Render 4 per-device previews simultaneously from the main canvas (REQ-002)
    this.previewCanvases.forEach((canvas, deviceKey) => {
      const pCtx = canvas.getContext('2d');
      if (pCtx) {
        renderDeviceCrop(pCtx, this.canvasEl, deviceKey);
      }
    });
  }

  /**
   * Run validation and update DOM verdicts + aria-live region
   */
  private validate(): void {
    if (this.phase !== 'READY') return;

    const verdicts = validateScene(this.scene, {
      sourceRaster: this.sourceDimensions,
      estimatedBytes: this.sourceFileSize,
      fontsLoaded: true,
      includeCacheDelay: this.hasExported || this.mode === 'check',
      isNonSrgb: this.isNonSrgb,
    });

    const verdictCount = verdicts.length;
    const errorCount = verdicts.filter((v) => v.severity === 'error').length;
    const hasOverflow = verdicts.some((v) => v.id.includes('overflow'));

    trackEvent('validation_run', {
      verdictCount,
      errorCount,
      hasOverflow,
    });

    if (this.verdictCountBadge) {
      const noticeWord = verdicts.length === 1
        ? (clientI18n?.diagnostics?.noticeSingular || 'Notice')
        : (clientI18n?.diagnostics?.noticePlural || 'Notices');
      this.verdictCountBadge.textContent = `${verdicts.length} ${noticeWord}`;
    }

    if (this.handoffFixBtn) {
      const hasText = this.scene.layers.some((l) => l.type === 'text');
      this.handoffFixBtn.textContent = hasText
        ? (clientI18n?.handoff?.editInMaker || 'Edit in Banner Maker →')
        : (clientI18n?.handoff?.fixInEditor || 'Fix in Resizer Editor →');
    }

    if (!this.verdictsContainerEl || !this.verdictAllClearEl) return;

    if (verdicts.length === 0) {
      this.verdictAllClearEl.classList.remove('hidden');
      this.verdictsContainerEl.innerHTML = '';
      this.canvasEl?.setAttribute(
        'aria-label',
        'YouTube banner preview. All elements fit securely within the mobile safe area.'
      );
      return;
    }

    this.verdictAllClearEl.classList.add('hidden');
    this.verdictsContainerEl.innerHTML = '';

    verdicts.forEach((v) => {
      const item = document.createElement('div');
      item.className =
        'p-3 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ' +
        (v.severity === 'error'
          ? 'bg-danger/5 border-danger/20 text-ink-950'
          : v.severity === 'warn'
            ? 'bg-warning/10 border-warning/30 text-ink-950'
            : 'bg-surface-50 border-line-200 text-ink-800');

      const icon = document.createElement('div');
      icon.className = 'shrink-0 mt-0.5 font-bold ' +
        (v.severity === 'error' ? 'text-danger' : v.severity === 'warn' ? 'text-warning' : 'text-accent');
      icon.textContent = v.severity === 'error' ? '✕' : v.severity === 'warn' ? '▲' : 'ℹ';

      const body = document.createElement('div');
      body.className = 'flex-1 space-y-1';

      const titleRow = document.createElement('div');
      titleRow.className = 'flex items-center justify-between gap-2';

      let vTitle = v.title;
      let vDetail = v.detail;

      if (clientI18n?.verdictMessages) {
        const vm = clientI18n.verdictMessages;
        if (v.id === 'cache-delay') {
          vTitle = vm.cacheDelayTitle || vTitle;
          vDetail = vm.cacheDelayDetail || vDetail;
        } else if (v.id === 'filesize-over') {
          vTitle = vm.filesizeOverTitle || vTitle;
          vDetail = vm.filesizeOverDetail || vDetail;
        } else if (v.id === 'low-resolution') {
          vTitle = vm.lowResTitle || vTitle;
          vDetail = vm.lowResDetail || vDetail;
        } else if (v.id === 'safe-overflow') {
          const match = v.title.match(/Your "(.*)" is cut off on mobile/);
          const name = match ? match[1] : 'element';
          vTitle = (vm.safeOverflowTitle || vTitle).replace('{name}', name);
          if (v.detail.includes('right')) {
            vDetail = vm.safeOverflowDetailRight || vDetail;
          } else if (v.detail.includes('left')) {
            vDetail = vm.safeOverflowDetailLeft || vDetail;
          } else if (v.detail.includes('down')) {
            vDetail = vm.safeOverflowDetailDown || vDetail;
          } else if (v.detail.includes('up')) {
            vDetail = vm.safeOverflowDetailUp || vDetail;
          } else {
            vDetail = vm.safeOverflowDetailGeneral || vDetail;
          }
        } else if (v.id === 'text-too-large') {
          const match = v.title.match(/Your "(.*)" may be hard to read on mobile/);
          const name = match ? match[1] : 'element';
          vTitle = (vm.textTooLargeTitle || vTitle).replace('{name}', name);
          vDetail = vm.textTooLargeDetail || vDetail;
        } else if (v.id === 'subject-outside-safe') {
          vTitle = vm.subjectOutsideTitle || vTitle;
          vDetail = vm.subjectOutsideDetail || vDetail;
        } else if (v.id === 'non-srgb-source') {
          vTitle = vm.nonSrgbTitle || vTitle;
          vDetail = vm.nonSrgbDetail || vDetail;
        } else if (v.id === 'font-not-loaded') {
          vTitle = vm.fontLoadingTitle || vTitle;
          vDetail = vm.fontLoadingDetail || vDetail;
        }
      }

      const title = document.createElement('p');
      title.className = 'font-semibold text-ink-950';
      title.textContent = vTitle;
      titleRow.appendChild(title);

      if (v.device && v.device !== 'all') {
        const badge = document.createElement('span');
        badge.className = 'text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-0 border border-line-200 text-ink-600 shrink-0';
        badge.textContent = v.device;
        titleRow.appendChild(badge);
      }

      const detail = document.createElement('p');
      detail.className = 'text-[11px] text-ink-600 leading-relaxed';
      detail.textContent = vDetail;

      body.appendChild(titleRow);
      body.appendChild(detail);

      // Add actionable control button if fixable (REQ-E13, Task 2.7)
      if (v.fixable) {
        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.className =
          'mt-1.5 min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium bg-surface-0 border border-line-200 text-ink-950 hover:bg-surface-50 focus-visible:ring-2 focus-visible:ring-accent cursor-pointer inline-flex items-center gap-1.5 transition-colors';

        if (this.mode === 'check') {
          const hasText = this.scene.layers.some((l) => l.type === 'text');
          actionBtn.textContent = hasText
            ? (clientI18n?.handoff?.editInMaker || 'Edit in Banner Maker →')
            : (clientI18n?.handoff?.fixInEditor || 'Fix in Resizer Editor →');
          actionBtn.addEventListener('click', () => {
            this.handoffToFixEditor();
          });
        } else if (v.device && v.device !== 'all' && v.device !== this.activeDevice) {
          const tmpl = clientI18n?.verdictMessages?.actionInspectCrop || 'Inspect {device} crop →';
          actionBtn.textContent = tmpl.replace('{device}', v.device.toUpperCase());
          actionBtn.addEventListener('click', () => {
            this.selectDevice(v.device as DeviceKey);
            this.canvasEl?.focus();
          });
        } else if (v.action === 'reposition') {
          actionBtn.textContent = clientI18n?.verdictMessages?.actionCenterImage || 'Center image';
          actionBtn.addEventListener('click', () => {
            this.centerPosition();
            this.canvasEl?.focus();
          });
        } else {
          actionBtn.textContent = clientI18n?.verdictMessages?.actionFocusCanvas || 'Focus canvas controls';
          actionBtn.addEventListener('click', () => {
            this.canvasEl?.focus();
          });
        }

        body.appendChild(actionBtn);
      }

      item.appendChild(icon);
      item.appendChild(body);

      this.verdictsContainerEl.appendChild(item);
    });

    // Update canvas aria-label for screen readers
    const topVerdict = verdicts[0];
    this.canvasEl?.setAttribute(
      'aria-label',
      `YouTube banner preview with ${verdicts.length} notices. Notice: ${topVerdict.title}. ${topVerdict.detail}`
    );
  }

  /**
   * Device switcher tab action (REQ-E4)
   */
  private selectDevice(device: DeviceKey): void {
    this.activeDevice = device;

    // Update tabs state with roving tabindex
    this.deviceTabButtons.forEach((btn, dev) => {
      const isSelected = dev === device;
      btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      btn.tabIndex = isSelected ? 0 : -1;
      if (isSelected) {
        btn.classList.add('bg-surface-0', 'text-ink-950', 'shadow-xs', 'font-semibold');
        btn.classList.remove('text-ink-600');
      } else {
        btn.classList.remove('bg-surface-0', 'text-ink-950', 'shadow-xs', 'font-semibold');
        btn.classList.add('text-ink-600');
      }
    });

    // Highlight preview card in grid
    this.previewCanvases.forEach((canvas, dev) => {
      const card = canvas.closest('.bg-surface-50');
      if (card) {
        if (dev === device) {
          card.classList.add('ring-2', 'ring-accent', 'border-accent');
        } else {
          card.classList.remove('ring-2', 'ring-accent', 'border-accent');
        }
      }
    });

    // Update guides overlay highlight
    if (this.safeZoneBox) {
      if (this.activeDevice === 'mobile') {
        this.safeZoneBox.classList.remove('opacity-40');
        this.safeZoneBox.classList.add('border-accent', 'bg-accent/15');
      } else {
        this.safeZoneBox.classList.add('opacity-40');
        this.safeZoneBox.classList.remove('border-accent', 'bg-accent/15');
      }
    }

    if (this.desktopGuideTop && this.desktopGuideBottom) {
      if (this.activeDevice === 'desktop') {
        this.desktopGuideTop.classList.add('border-ink-950', 'border-solid');
        this.desktopGuideBottom.classList.add('border-ink-950', 'border-solid');
        this.desktopGuideBand?.classList.add('border-ink-950/60');
      } else {
        this.desktopGuideTop.classList.remove('border-ink-950', 'border-solid');
        this.desktopGuideBottom.classList.remove('border-ink-950', 'border-solid');
        this.desktopGuideBand?.classList.remove('border-ink-950/60');
      }
    }

    if (this.tabletGuideBox) {
      if (this.activeDevice === 'tablet') {
        this.tabletGuideBox.classList.add('border-accent', 'bg-accent/5');
      } else {
        this.tabletGuideBox.classList.remove('border-accent', 'bg-accent/5');
      }
    }

    if (this.tvGuideBox) {
      if (this.activeDevice === 'tv') {
        this.tvGuideBox.classList.add('border-accent', 'border-2');
      } else {
        this.tvGuideBox.classList.remove('border-accent', 'border-2');
      }
    }
  }

  /**
   * Reposition helpers
   */
  private setZoom(val: number): void {
    if (this.scene.background.type !== 'image' || !this.currentImageElement) return;
    const sw = this.sourceDimensions.w;
    const sh = this.sourceDimensions.h;
    const cap = Math.min(sw / CANVAS.width, sh / CANVAS.height);
    const maxZoom = Math.max(1, cap);

    // Announce clamp if user attempts to exceed 1:1 optical ceiling (REQ-E3)
    if (val > maxZoom && this.scene.background.zoom >= maxZoom - 0.001) {
      this.announceMessage('Already at full source resolution');
      if (this.zoomWarningEl) {
        this.zoomWarningEl.textContent = 'Already at full source resolution';
        this.zoomWarningEl.classList.remove('hidden');
      }
    }

    this.applyChange({
      background: {
        ...this.scene.background,
        zoom: val,
      },
    });
  }

  private adjustZoom(delta: number): void {
    if (this.scene.background.type !== 'image') return;
    this.pushUndo(this.scene);
    const current = this.scene.background.zoom;
    this.setZoom(current + delta);
  }

  private nudge(dx: number, dy: number): void {
    if (this.scene.background.type !== 'image') return;
    this.pushUndo(this.scene);
    this.applyChange({
      background: {
        ...this.scene.background,
        offsetX: this.scene.background.offsetX + dx,
        offsetY: this.scene.background.offsetY + dy,
      },
    });
  }

  private centerPosition(): void {
    if (this.scene.background.type !== 'image') return;
    this.pushUndo(this.scene);
    this.applyChange({
      background: {
        ...this.scene.background,
        offsetX: 0,
        offsetY: 0,
      },
    });
    this.showToast('Position centered');
  }

  private resetReposition(): void {
    if (this.scene.background.type !== 'image') return;
    this.pushUndo(this.scene);
    this.applyChange({
      background: {
        ...this.scene.background,
        offsetX: 0,
        offsetY: 0,
        zoom: 1,
        extend: false,
      },
    });
    if (this.extendToggle) this.extendToggle.checked = false;
    this.showToast('Position & zoom reset');
  }

  private pushUndo(prevScene: Scene): void {
    this.undoStack.push(cloneScene(prevScene));
    if (this.undoStack.length > this.MAX_UNDO) {
      this.undoStack.shift();
    }
    this.redoStack = [];
    this.updateUndoRedoButtons();
  }

  private undo(): void {
    if (this.undoStack.length === 0) return;
    const prev = this.undoStack.pop();
    if (!prev) return;
    this.redoStack.push(cloneScene(this.scene));
    this.scene = prev;
    this.updateUndoRedoButtons();
    this.scheduleFrame();
    this.validate();
    this.persist();
    this.showToast('Undone');
  }

  private redo(): void {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop();
    if (!next) return;
    this.undoStack.push(cloneScene(this.scene));
    this.scene = next;
    this.updateUndoRedoButtons();
    this.scheduleFrame();
    this.validate();
    this.persist();
    this.showToast('Redone');
  }

  private updateUndoRedoButtons(): void {
    if (this.btnUndoEl) {
      this.btnUndoEl.disabled = this.undoStack.length === 0;
    }
    if (this.btnRedoEl) {
      this.btnRedoEl.disabled = this.redoStack.length === 0;
    }
  }

  private showToast(msg: string, durationMs = 2500): void {
    if (!this.toolToastEl || !this.toolToastTextEl) return;
    let displayMsg = msg;
    if (clientI18n?.toasts) {
      const t = clientI18n.toasts;
      if (msg === 'Centered artwork') displayMsg = t.centeredArtwork || msg;
      else if (msg === 'Loaded image from clipboard') displayMsg = t.loadedClipboard || msg;
      else if (msg === 'Reset zoom & centered') displayMsg = t.resetZoom || msg;
      else if (msg.startsWith('Applied ') && msg.endsWith(' style')) displayMsg = `${t.appliedStyle || 'Applied style'} (${msg.slice(8, -6)})`;
      else if (msg.startsWith('Applied ') && msg.endsWith(' style variation')) displayMsg = `${t.variationApplied || 'Applied style variation'} (${msg.slice(8, -16)})`;
      else if (msg === 'Photo removed from frame') displayMsg = t.photoRemovedFrame || msg;
      else if (msg === 'Photo frame removed') displayMsg = t.photoFrameRemoved || msg;
      else if (msg === 'Photo frame added to canvas') displayMsg = t.photoFrameAdded || msg;
      else if (msg === 'Accent rule added') displayMsg = t.accentRuleAdded || msg;
      else if (msg === 'Backplate card added') displayMsg = t.backplateAdded || msg;
      else if (msg === 'Brand badge added') displayMsg = t.brandBadgeAdded || msg;
      else if (msg === 'Shapes removed') displayMsg = t.shapesRemoved || msg;
      else if (msg === 'Aligned to Left Avatar layout') displayMsg = t.alignedLeft || msg;
      else if (msg === 'Aligned to Centered layout') displayMsg = t.alignedCenter || msg;
      else if (msg === 'Aligned to Text + Card layout') displayMsg = t.alignedRight || msg;
      else if (msg === 'Applied typography pairing') displayMsg = t.appliedTypography || msg;
      else if (msg === 'Tagline updated') displayMsg = t.taglineUpdated || msg;
      else if (msg === 'Live 60 FPS motion activated') displayMsg = t.motionActivated || msg;
      else if (msg === 'Recording 60 FPS WebM video loop...') displayMsg = t.recordingVideo || msg;
      else if (msg === '60 FPS animated banner exported!') displayMsg = t.motionExported || msg;
      else if (msg.startsWith('Recording failed')) displayMsg = t.recordingFailed || msg;
      else if (msg === 'OBS Browser Source snippet copied!') displayMsg = t.obsCopied || msg;
      else if (msg === 'CSS animation keyframes copied!') displayMsg = t.cssCopied || msg;
      else if (msg === 'Clipboard access unavailable') displayMsg = t.clipboardUnavailable || msg;
      else if (msg.startsWith('Badge updated')) displayMsg = t.badgeUpdated || msg;
      else if (msg === 'Badge removed') displayMsg = t.badgeRemoved || msg;
      else if (msg === 'Image exceeds 6 MB maximum limit') displayMsg = t.imageExceeds6Mb || msg;
      else if (msg === 'Please upload a valid image file') displayMsg = t.validImageFile || msg;
      else if (msg === 'Photo placed in frame') displayMsg = t.photoPlacedFrame || msg;
      else if (msg === 'Position centered') displayMsg = t.positionCentered || msg;
      else if (msg === 'Position & zoom reset') displayMsg = t.positionReset || msg;
      else if (msg === 'Undone') displayMsg = t.undone || msg;
      else if (msg === 'Redone') displayMsg = t.redone || msg;
      else if (msg === 'Generating clipboard image...') displayMsg = t.generatingClipboard || msg;
      else if (msg.includes('PNG to clipboard!')) displayMsg = t.copiedClipboard || msg;
      else if (msg === 'Failed to copy to clipboard') displayMsg = t.failedClipboard || msg;
      else if (msg === 'Generating 1280 × 720 HD thumbnail...') displayMsg = t.generatingThumbnail || msg;
      else if (msg === 'Downloaded 1280 × 720 YouTube Thumbnail!') displayMsg = t.downloadedThumbnail || msg;
      else if (msg === 'Thumbnail generation failed') displayMsg = t.thumbnailFailed || msg;
    }
    this.toolToastTextEl.textContent = displayMsg;
    this.toolToastEl.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
    this.toolToastEl.classList.add('opacity-100', 'translate-y-0');
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      this.toolToastEl?.classList.remove('opacity-100', 'translate-y-0');
      this.toolToastEl?.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
    }, durationMs);
  }

  private toggleShortcutsModal(): void {
    if (!this.shortcutsModalEl) return;
    this.shortcutsModalEl.classList.toggle('hidden');
  }

  private async copyToClipboard(): Promise<void> {
    if (this.phase !== 'READY') return;
    try {
      this.showToast('Generating clipboard image...');
      const canvas = renderExport(this.scene, this.images);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          this.showToast('Failed to generate image blob');
          return;
        }
        try {
          if (navigator.clipboard && typeof navigator.clipboard.write === 'function') {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob }),
            ]);
            this.showToast(`Copied ${CANVAS.width} × ${CANVAS.height} PNG to clipboard!`);
            trackEvent('export_success', {
              format: 'png',
              durationMs: 0,
            });
          } else {
            this.showToast('Clipboard API unavailable; click Download');
          }
        } catch (err) {
          console.warn('Clipboard write error:', err);
          this.showToast('Clipboard access denied; click Download');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard copy error:', err);
      this.showToast('Failed to copy to clipboard');
    }
  }

  private updateZoomControlsRange(): void {
    if (!this.zoomSlider || !this.currentImageElement) return;
    const sw = this.sourceDimensions.w;
    const sh = this.sourceDimensions.h;
    const cap = Math.min(sw / CANVAS.width, sh / CANVAS.height);
    const maxZoom = Math.max(1, cap);

    this.zoomSlider.min = '1';
    this.zoomSlider.max = Math.max(1.01, maxZoom).toFixed(2);
    this.zoomSlider.value = (this.scene.background.type === 'image' ? this.scene.background.zoom : 1).toFixed(2);
  }

  /**
   * Run YouTube re-encode simulation (REQ-005, §D.3)
   */
  private async runSimulation(): Promise<void> {
    if (!this.canvasEl || !this.simulateCanvas) return;
    try {
      const res = await simulateReencode(this.canvasEl, {
        device: 'desktop',
        format: 'jpeg',
      });

      const simCtx = this.simulateCanvas.getContext('2d');
      if (simCtx && res.dataUrl) {
        const simImg = new Image();
        simImg.onload = () => {
          this.simulateCanvas.width = simImg.naturalWidth;
          this.simulateCanvas.height = simImg.naturalHeight;
          simCtx.drawImage(simImg, 0, 0);
        };
        simImg.src = res.dataUrl;
      }

      if (this.simulateStats) {
        this.simulateStats.textContent = `~${Math.round(res.bytes / 1024)} KB (q=${res.quality})`;
      }
    } catch {
      // Gracefully handle simulation error
    }
  }

  /**
   * Export handler adhering to §D.2 states and BLOCKED advisory rule
   */
  private async handleExportAction(): Promise<void> {
    if (this.phase !== 'READY') return;

    // Step 1: Synchronous validation check (D-9)
    const verdicts = validateScene(this.scene, {
      sourceRaster: this.sourceDimensions,
      estimatedBytes: this.sourceFileSize,
    });

    const hasErrors = verdicts.some((v) => v.severity === 'error');

    // §D.2: BLOCKED is advisory, not preventive: if error verdicts exist, button label changes to "Export anyway"
    if (hasErrors && !this.exportAnywayAcknowledged) {
      this.exportAnywayAcknowledged = true;
      if (this.exportButtonText) {
        this.exportButtonText.textContent = clientI18n?.exportBtn?.exportAnyway || 'Export anyway';
      }
      this.verdictsRegionEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      this.announceMessage('Warning: Banner has elements cut off outside safe boundaries. Click Export anyway to confirm download.');
      return;
    }

    // Proceed to full resolution export
    await this.runExport();
  }

  /**
   * Full-resolution export execution (REQ-010, REQ-011, REQ-012, REQ-026)
   */
  private async runExport(): Promise<void> {
    this.announceMessage('Rendering 2560 × 1440 px banner at full resolution...');

    const chosenFormat = cleanImageFormat(this.exportFormatSelect?.value || 'jpeg');
    trackEvent('export_start', { format: chosenFormat });
    const startTime = performance.now();

    if (this.exportButton) {
      this.exportButton.disabled = true;
    }
    if (this.exportButtonText) {
      this.exportButtonText.textContent = (clientI18n?.exportBtn?.rendering || 'Rendering {dims}...').replace('{dims}', '2560 × 1440');
    }

    try {
      // Step 2: Render full resolution banner
      const result = await exportBanner(this.scene, this.images);

      const durationMs = Math.round(performance.now() - startTime);
      const finalFormat = cleanImageFormat(result.type);
      trackEvent('export_success', {
        format: finalFormat,
        durationMs,
      });

      if (!this.hasExported) {
        trackEvent('activation', {});
      } else {
        trackEvent('re_export', {});
      }

      // Step 3: Trigger instant browser download
      const blobUrl = URL.createObjectURL(result.blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = blobUrl;
      downloadAnchor.download = result.filename;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      document.body.removeChild(downloadAnchor);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);

      // Step 4: Display separately labelled output metadata (REQ-026)
      if (this.exportMeta) {
        const sizeMb = (result.bytes / (1024 * 1024)).toFixed(2);
        this.exportMeta.textContent = `${sizeMb} MB (${result.type.replace('image/', '').toUpperCase()})`;
      }

      // Step 5: Show note if browser forced a fallback type (REQ-011) or PNG oversize
      if (this.exportNote) {
        if (result.note) {
          this.exportNote.textContent = result.note;
          this.exportNote.classList.remove('hidden');
          this.announceMessage(result.note);
        } else {
          this.exportNote.classList.add('hidden');
        }
      }

      // Step 6: Mark exported, surface cache-delay advisory in verdicts
      this.hasExported = true;
      this.validate();

      this.announceMessage('Banner downloaded successfully. Verified 2560 × 1440 px file.');
    } catch {
      this.showFileError('Export failed', 'Canvas export could not be completed. Please try choosing JPEG format.');
    } finally {
      this.exportAnywayAcknowledged = false;
      if (this.exportButton) {
        this.exportButton.disabled = false;
      }
      if (this.exportButtonText) {
        this.exportButtonText.textContent = 'Download Banner';
      }
    }
  }

  /**
   * Fast HD Thumbnail Export (1280x720 16:9, sub-2MB YouTube spec)
   * Enables zero-friction thumbnail creation for creators without Canva knowledge.
   */
  private async handleThumbnailExport(): Promise<void> {
    if (this.phase !== 'READY') return;
    this.showToast('Generating 1280 × 720 HD thumbnail...');

    try {
      if (this.exportThumbnailBtn) {
        this.exportThumbnailBtn.disabled = true;
      }

      const fullCanvas = renderExport(this.scene, this.images);

      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 1280;
      thumbCanvas.height = 720;
      const tCtx = thumbCanvas.getContext('2d', { colorSpace: 'srgb' });
      if (!tCtx) throw new Error('Could not create thumbnail 2D canvas context');

      tCtx.imageSmoothingEnabled = true;
      tCtx.imageSmoothingQuality = 'high';
      tCtx.drawImage(fullCanvas, 0, 0, 1280, 720);

      thumbCanvas.toBlob((blob) => {
        if (!blob) {
          this.showToast('Thumbnail generation failed');
          if (this.exportThumbnailBtn) this.exportThumbnailBtn.disabled = false;
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'youtube-thumbnail-1280x720.jpg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (this.exportThumbnailBtn) this.exportThumbnailBtn.disabled = false;
        this.showToast('Downloaded 1280 × 720 YouTube Thumbnail!');
        trackEvent('export_success', { format: 'jpeg', durationMs: 0 });
      }, 'image/jpeg', 0.90);
    } catch (err: any) {
      if (this.exportThumbnailBtn) this.exportThumbnailBtn.disabled = false;
      this.showToast(`Thumbnail export error: ${err.message || 'Failed'}`);
    }
  }

  /**
   * Coordinated Avatar Export (800x800 square, sub-6MB YouTube spec)
   * Derives matching YouTube profile avatar from banner branding and theme palette.
   */
  private async handleAvatarExport(): Promise<void> {
    if (this.phase !== 'READY') return;
    this.showToast('Generating 800 × 800 matching avatar...');

    try {
      if (this.exportAvatarBtn) {
        this.exportAvatarBtn.disabled = true;
      }

      const result = await exportAvatar(this.scene, this.images);

      const url = URL.createObjectURL(result.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (this.exportAvatarBtn) this.exportAvatarBtn.disabled = false;
      this.showToast('Downloaded matching 800 × 800 profile avatar!');
      trackEvent('export_success', { format: result.type, durationMs: 0 });
    } catch (err: any) {
      if (this.exportAvatarBtn) this.exportAvatarBtn.disabled = false;
      this.showToast(`Avatar export error: ${err.message || 'Failed'}`);
    }
  }

  /**
   * Helper to announce messages politely to assistive technology
   */
  private announceMessage(msg: string): void {
    if (this.verdictsRegionEl) {
      const liveNotice = document.createElement('div');
      liveNotice.className = 'sr-only';
      liveNotice.textContent = msg;
      this.verdictsRegionEl.appendChild(liveNotice);
      setTimeout(() => liveNotice.remove(), 3000);
    }
  }

  /**
   * Persist scene state to sessionStorage with D-10 handling (200 ms debounce)
   */
  private schedulePersist(): void {
    if (this.persistTimer !== null) {
      window.clearTimeout(this.persistTimer);
    }

    this.persistTimer = window.setTimeout(() => {
      this.persistTimer = null;
      this.persist();
    }, 200);
  }

  /**
   * Handoff to Fix door editor (REQ-E13, Gate 4)
   */
  private handoffToFixEditor(): void {
    this.persist();
    const m = window.location.pathname.match(/^\/(es|de|fr|pt-br|it|ja)\b/);
    const prefix = m ? m[0] : '';
    if (this.scene.layers.some((l) => l.type === 'text')) {
      window.location.href = `${prefix}/tools/youtube-banner-maker`;
    } else {
      window.location.href = `${prefix}/tools/youtube-banner-resizer`;
    }
  }

  private persist(): void {
    try {
      const toSave = cloneScene(this.scene);
      // D-10: Only persist source image if under 3 MB
      if (toSave.background.type === 'image') {
        if (this.sourceFileSize > 3 * 1024 * 1024) {
          toSave.background.src = ''; // Clear image src for oversize
        } else if (this.sourceDataUrl) {
          toSave.background.src = this.sourceDataUrl;
        } else if (this.currentImageElement && this.currentImageElement.src.startsWith('data:image/')) {
          toSave.background.src = this.currentImageElement.src;
        }
      }
      sessionStorage.setItem(SCENE_KEY, serializeScene(toSave));
    } catch {
      // Storage quota limit exceeded or disabled
    }
  }
}

// Auto-boot island on DOM ready
if (typeof window !== 'undefined') {
  const initIsland = () => {
    const island = new ToolIsland();
    island.init();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIsland);
  } else {
    initIsland();
  }
}
