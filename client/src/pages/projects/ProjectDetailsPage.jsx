import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import UploadDropzone from '../../components/upload/UploadDropzone';
import ComparisonSlider from '../../components/project/ComparisonSlider';
import GeneratedImagesGrid from '../../components/project/GeneratedImagesGrid';
import GenerationStatusBadge from '../../components/project/GenerationStatusBadge';
import {
  useGenerateRendersMutation,
  useGetProjectQuery,
  useListGenerationsQuery,
  useUploadBlueprintMutation,
} from '../../features/projects/projectsApi';
import { useToast } from '../../components/ui/ToastProvider';

const styleOptions = ['Modern Minimal', 'Scandinavian Warm', 'Industrial Luxe', 'Contemporary Luxury'];

function inferImageExtension(url, fallback = 'png') {
  try {
    const pathname = new URL(url).pathname;
    const match = pathname.match(/\.([a-zA-Z0-9]+)$/);
    return match?.[1] || fallback;
  } catch {
    return fallback;
  }
}

function triggerDownload(href, filename, openInNewTab = false) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  if (openInNewTab) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadFileFromUrl(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed download request: ${response.status}`);
    }
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    triggerDownload(objectUrl, filename);
    URL.revokeObjectURL(objectUrl);
    return true;
  } catch {
    // Fallback for sources that block CORS fetch; opens file for manual save.
    triggerDownload(url, filename, true);
    return false;
  }
}

function ProjectDetailsPage() {
  const { id } = useParams();
  const { pushToast } = useToast();
  const { data: project } = useGetProjectQuery(id);
  const { data: generationsData, refetch } = useListGenerationsQuery({ id, page: 1, pageSize: 20 }, { pollingInterval: 6000 });
  const [uploadBlueprint, { isLoading: isUploading }] = useUploadBlueprintMutation();
  const [generateRenders, { isLoading: isGenerating }] = useGenerateRendersMutation();

  const [style, setStyle] = useState(styleOptions[0]);
  const [count, setCount] = useState(6);
  const [selectedAfter, setSelectedAfter] = useState(null);
  const [isDownloadingBlueprint, setIsDownloadingBlueprint] = useState(false);
  const [isDownloadingSelected, setIsDownloadingSelected] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const latestGeneration = useMemo(() => generationsData?.items?.[0] || null, [generationsData]);
  const gallery = latestGeneration?.outputImages || [];

  const beforeImage = project?.blueprintOriginalUrl || null;
  const afterImage = selectedAfter || gallery[0] || null;

  const onUpload = async (file) => {
    try {
      await uploadBlueprint({ id, file }).unwrap();
      pushToast({ message: 'Blueprint uploaded successfully.' });
      refetch();
    } catch (error) {
      pushToast({ type: 'error', message: error?.data?.message || 'Upload failed' });
    }
  };

  const onGenerate = async () => {
    try {
      await generateRenders({ id, style, count }).unwrap();
      pushToast({ message: 'Generation queued.' });
      setSelectedAfter(null);
      refetch();
    } catch (error) {
      pushToast({ type: 'error', message: error?.data?.message || 'Generation failed' });
    }
  };

  const onDownloadBlueprint = async () => {
    if (!beforeImage) {
      return;
    }

    setIsDownloadingBlueprint(true);
    try {
      const extension = inferImageExtension(beforeImage, 'png');
      await downloadFileFromUrl(beforeImage, `archify-blueprint.${extension}`);
      pushToast({ message: 'Blueprint download started.' });
    } catch (error) {
      pushToast({ type: 'error', message: error?.message || 'Blueprint download failed' });
    } finally {
      setIsDownloadingBlueprint(false);
    }
  };

  const onDownloadSelected = async () => {
    if (!afterImage) {
      return;
    }

    setIsDownloadingSelected(true);
    try {
      const extension = inferImageExtension(afterImage, 'png');
      await downloadFileFromUrl(afterImage, `archify-render-selected.${extension}`);
      pushToast({ message: 'Render download started.' });
    } catch (error) {
      pushToast({ type: 'error', message: error?.message || 'Render download failed' });
    } finally {
      setIsDownloadingSelected(false);
    }
  };

  const onDownloadAll = async () => {
    if (!gallery.length) {
      return;
    }

    setIsDownloadingAll(true);
    try {
      for (let index = 0; index < gallery.length; index += 1) {
        const image = gallery[index];
        const extension = inferImageExtension(image, 'png');
        // eslint-disable-next-line no-await-in-loop
        await downloadFileFromUrl(image, `archify-render-${index + 1}.${extension}`);
      }
      pushToast({ message: `Started downloads for ${gallery.length} renders.` });
    } catch (error) {
      pushToast({ type: 'error', message: error?.message || 'Bulk download failed' });
    } finally {
      setIsDownloadingAll(false);
    }
  };

  return (
    <DashboardShell
      tone="warm"
      title={project?.title || 'Project'}
      subtitle="Upload a blueprint and generate photoreal 2D render outputs."
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="space-y-5 p-5">
          <div>
            <h3 className="font-semibold text-sand-900">1. Upload blueprint</h3>
            <p className="mt-1 text-xs text-sand-700">PNG/JPG/PDF up to 15MB</p>
            <div className="mt-3">
              <UploadDropzone onUpload={onUpload} isUploading={isUploading} tone="warm" />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sand-900">2. Configure generation</h3>
            <div className="mt-3 space-y-3 text-sm text-sand-900">
              <label className="block font-medium">
                Style
                <select
                  value={style}
                  onChange={(event) => setStyle(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-sand-300 bg-white/85 px-3 py-2 text-sand-900 outline-none ring-0 focus:border-wood-400"
                >
                  {styleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block font-medium">
                Output
                <div className="mt-1 rounded-lg border border-sand-300 bg-white/85 px-3 py-2 text-sand-900">
                  Photoreal 2D
                </div>
              </label>

              <label className="block font-medium">
                Image count
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={count}
                  onChange={(event) => setCount(Number(event.target.value))}
                  className="mt-1 w-full rounded-lg border border-sand-300 bg-white/85 px-3 py-2 text-sand-900 outline-none ring-0 focus:border-wood-400"
                />
              </label>
            </div>
            <Button className="mt-4 w-full" onClick={onGenerate} disabled={isGenerating || !project?.blueprintOriginalUrl}>
              {isGenerating ? 'Queueing...' : 'Generate renders'}
            </Button>
          </div>

          <div>
            <h3 className="font-semibold text-sand-900">3. Status</h3>
            {latestGeneration ? (
              <div className="mt-2 flex items-center gap-2">
                <GenerationStatusBadge status={latestGeneration.status} tone="warm" />
                <span className="text-xs text-sand-700">
                  {new Date(latestGeneration.createdAt).toLocaleString()}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-sand-700">No generations yet.</p>
            )}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-4">
            <div className="mb-3 flex justify-end">
              <Button
                variant="secondary"
                onClick={onDownloadBlueprint}
                disabled={!beforeImage || isDownloadingBlueprint}
              >
                {isDownloadingBlueprint ? 'Downloading...' : 'Download blueprint'}
              </Button>
            </div>
            {!beforeImage ? (
              <EmptyState
                title="Upload blueprint to preview"
                message="The Before view uses your actual uploaded blueprint."
                tone="warm"
              />
            ) : !afterImage ? (
              <div className="space-y-3">
                <img
                  src={beforeImage}
                  alt="Uploaded blueprint"
                  className="h-[420px] w-full rounded-xl object-cover"
                />
                <p className="text-sm text-sand-700">
                  Generate outputs to compare this blueprint against rendered results.
                </p>
              </div>
            ) : (
              <ComparisonSlider beforeImage={beforeImage} afterImage={afterImage} tone="warm" />
            )}
          </Card>
          <Card className="p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-sand-900">Generated images</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={onDownloadSelected}
                  disabled={!afterImage || isDownloadingSelected}
                >
                  {isDownloadingSelected ? 'Downloading...' : 'Download selected'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={onDownloadAll}
                  disabled={!gallery.length || isDownloadingAll}
                >
                  {isDownloadingAll ? 'Downloading all...' : 'Download all'}
                </Button>
              </div>
            </div>
            {gallery.length ? (
              <GeneratedImagesGrid
                images={gallery}
                selectedImage={afterImage}
                onSelect={(image) => setSelectedAfter(image)}
                tone="warm"
              />
            ) : (
              <EmptyState
                title="No outputs yet"
                message="Generated images will appear here after the job succeeds."
                tone="warm"
              />
            )}
          </Card>
          {generationsData?.items?.length ? (
            <Card className="p-4">
              <h3 className="mb-3 text-sm font-semibold text-sand-900">Generation history</h3>
              <div className="space-y-2">
                {generationsData.items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between rounded-lg border border-sand-300 p-3">
                    <div>
                      <p className="text-sm text-sand-900">
                        {item.style} · {item.outputType} · {item.requestedCount} images
                      </p>
                      <p className="text-xs text-sand-700">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <GenerationStatusBadge status={item.status} tone="warm" />
                  </div>
                ))}
              </div>
            </Card>
          ) : null}
        </div>
      </div>
    </DashboardShell>
  );
}

export default ProjectDetailsPage;


