import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardShell from '../../components/layout/DashboardShell';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import ComparisonSlider from '../../components/project/ComparisonSlider';
import GenerationStatusBadge from '../../components/project/GenerationStatusBadge';
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useListGenerationsQuery,
  useListProjectsQuery,
} from '../../features/projects/projectsApi';
import { useToast } from '../../components/ui/ToastProvider';

function ProjectPreviewCard({ project, onDelete }) {
  const [selectedAfter, setSelectedAfter] = useState(null);
  const [showVariants, setShowVariants] = useState(false);

  const { data: generationsData, isFetching: isLoadingGenerations } = useListGenerationsQuery(
    { id: project._id, page: 1, pageSize: 1 },
    { skip: !project.blueprintOriginalUrl },
  );

  const latestGeneration = generationsData?.items?.[0] || null;
  const outputImages = latestGeneration?.outputImages || [];
  const beforeImage = project.blueprintOriginalUrl || null;
  const afterImage = selectedAfter || outputImages[0] || null;
  const hasComparison = Boolean(beforeImage && afterImage);

  useEffect(() => {
    if (!selectedAfter || outputImages.includes(selectedAfter)) {
      return;
    }
    setSelectedAfter(outputImages[0] || null);
  }, [outputImages, selectedAfter]);

  return (
    <Card className="space-y-4 p-4">
      {hasComparison ? (
        <ComparisonSlider
          beforeImage={beforeImage}
          afterImage={afterImage}
          tone="warm"
          imageClassName="h-48"
        />
      ) : beforeImage ? (
        <div className="overflow-hidden rounded-2xl border border-sand-300">
          <img src={beforeImage} alt="Uploaded blueprint" className="h-48 w-full object-cover" />
        </div>
      ) : (
        <EmptyState
          title="No blueprint yet"
          message="Open this project and upload a blueprint to enable preview."
          tone="warm"
        />
      )}

      {latestGeneration ? (
        <div className="flex items-center justify-between">
          <GenerationStatusBadge status={latestGeneration.status} tone="warm" />
          <p className="text-xs text-sand-700">{new Date(latestGeneration.createdAt).toLocaleString()}</p>
        </div>
      ) : isLoadingGenerations ? (
        <p className="text-xs text-sand-700">Loading latest generation...</p>
      ) : (
        <p className="text-xs text-sand-700">No generated outputs yet.</p>
      )}

      {outputImages.length > 1 ? (
        <div className="rounded-xl border border-sand-300/90 bg-white/70 p-2">
          <button
            type="button"
            className="w-full rounded-md px-2 py-1 text-left text-xs font-semibold text-sand-900 hover:bg-sand-100/80"
            onClick={() => setShowVariants((prev) => !prev)}
          >
            {showVariants ? 'Hide variants' : `Show variants (${outputImages.length})`}
          </button>
          {showVariants ? (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {outputImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedAfter(image)}
                  className={`overflow-hidden rounded-lg border ${
                    afterImage === image ? 'border-wood-500' : 'border-sand-300'
                  }`}
                  aria-label={`Select variant ${index + 1}`}
                >
                  <img src={image} alt={`Generated variant ${index + 1}`} className="h-14 w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Link to={`/projects/${project._id}`}>
          <Button variant="secondary">Open</Button>
        </Link>
        <Button variant="ghost" onClick={() => onDelete(project._id)}>
          Delete
        </Button>
      </div>
    </Card>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const { data, isFetching } = useListProjectsQuery({ page: 1, pageSize: 20 });
  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const { pushToast } = useToast();

  const onCreate = async () => {
    try {
      const project = await createProject({}).unwrap();
      pushToast({ message: 'Project created. Upload your blueprint now.' });
      navigate(`/projects/${project._id}`);
    } catch (error) {
      pushToast({ type: 'error', message: error?.data?.message || 'Create failed' });
    }
  };

  const onDelete = async (id) => {
    try {
      await deleteProject(id).unwrap();
      pushToast({ message: 'Project deleted' });
    } catch (error) {
      pushToast({ type: 'error', message: error?.data?.message || 'Delete failed' });
    }
  };

  return (
    <DashboardShell
      tone="warm"
      title="Projects"
      subtitle="Manage uploads, generations, and revisions across all blueprints."
      actions={
        <Button onClick={onCreate} disabled={isCreating}>
          {isCreating ? 'Creating...' : 'New project'}
        </Button>
      }
    >
      {isFetching ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, idx) => (
            <Skeleton key={idx} className="h-[340px] bg-sand-200/90" />
          ))}
        </div>
      ) : data?.items?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((project) => (
            <ProjectPreviewCard key={project._id} project={project} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects yet"
          message="Create a project, upload a blueprint, and generate photoreal 2D outputs."
          tone="warm"
          action={
            <Button onClick={onCreate} disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create project'}
            </Button>
          }
        />
      )}
    </DashboardShell>
  );
}

export default DashboardPage;

