import * as stylex from "@stylexjs/stylex";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Link,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

import Button from "#components/ui/button.component";
import Loading from "#components/ui/loading.component";
import { PaperField } from "#components/ui/paper-field.component";
import type { AudioAsset, TrackEntry } from "#lib/shared/audio/audio.schema";

import { useAudioLibrary } from "./audio-library.hook";
import { editorStyles as styles } from "./home-editor.style";
import { recordingTime, RecordPreview } from "./record-preview.component";

type Props = Readonly<{
  tracks: readonly TrackEntry[];
  change: (tracks: TrackEntry[]) => void;
  assets: readonly AudioAsset[];
  onAssets: (assets: readonly AudioAsset[]) => void;
  errors: Readonly<Record<string, string>>;
  onBusy: (busy: boolean) => void;
}>;

function RecordingRow({
  track,
  index,
  duration,
  selected,
  select,
}: Readonly<{
  track: TrackEntry;
  index: number;
  duration: number | null;
  selected: boolean;
  select: () => void;
}>) {
  return (
    <li
      {...stylex.props(styles.passageRow, selected && styles.selectedPassage)}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={select}
        {...stylex.props(styles.passageButton)}
      >
        <span {...stylex.props(styles.passageNumber)}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span {...stylex.props(styles.recordSummary)}>
          <span {...stylex.props(styles.passageSummary)}>
            {track.title || "Untitled recording"}
          </span>
          <span {...stylex.props(styles.muted)}>
            {duration ? recordingTime(duration) : "Preparing…"}
          </span>
        </span>
      </button>
    </li>
  );
}

export function RecordEditor({
  tracks,
  change,
  assets,
  onAssets,
  errors,
  onBusy,
}: Props) {
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState(tracks[0]?.assetId ?? "");
  const [adding, setAdding] = useState(tracks.length === 0);
  const upload = useRef<HTMLInputElement>(null);
  const library = useAudioLibrary(assets, onAssets, onBusy);
  const index = Math.max(
    0,
    tracks.findIndex((track) => track.assetId === selected),
  );
  const current = tracks.at(index);
  const asset =
    current && assets.find((recording) => recording.id === current.assetId);
  const move = (to: number) => {
    if (current) change(tracks.toSpliced(index, 1).toSpliced(to, 0, current));
  };
  return (
    <>
      {current ? (
        <section aria-label="Recordings" {...stylex.props(styles.passages)}>
          <div {...stylex.props(styles.passageDirectory)}>
            <h3 {...stylex.props(styles.sectionTitle)}>
              Recordings{" "}
              <span {...stylex.props(styles.muted)}>{tracks.length}</span>
            </h3>
            <ul {...stylex.props(styles.passageList)}>
              {tracks.map((track, i) => (
                <RecordingRow
                  key={track.assetId}
                  track={track}
                  index={i}
                  duration={
                    assets.find((recording) => recording.id === track.assetId)
                      ?.duration ?? null
                  }
                  selected={track.assetId === current.assetId}
                  select={() => setSelected(track.assetId)}
                />
              ))}
            </ul>
          </div>
          <div {...stylex.props(styles.group)}>
            <PaperField
              label="Track title"
              value={current.title}
              maxLength={200}
              error={errors[`config.tracks.${index}.title`]}
              onValueChange={(title) =>
                change(
                  tracks.map((track) =>
                    track.assetId === current.assetId
                      ? { ...track, title }
                      : track,
                  ),
                )
              }
            />
            <PaperField
              label="Artist"
              value={current.artist}
              maxLength={200}
              error={errors[`config.tracks.${index}.artist`]}
              onValueChange={(artist) =>
                change(
                  tracks.map((track) =>
                    track.assetId === current.assetId
                      ? { ...track, artist }
                      : track,
                  ),
                )
              }
            />
            {asset && <RecordPreview key={asset.id} asset={asset} />}
            {asset && asset.spectrumStatus !== "ready" && (
              <div {...stylex.props(styles.row)}>
                <span {...stylex.props(styles.muted)}>
                  Spectrum {asset.spectrumStatus}
                </span>
                {asset.spectrumStatus === "failed" && (
                  <Button
                    disabled={library.busy}
                    onClick={() => void library.retry(asset.id)}
                  >
                    <RefreshCw size={14} />
                    Retry
                  </Button>
                )}
              </div>
            )}
            <div {...stylex.props(styles.row)}>
              <Button
                aria-label="Move recording up"
                disabled={index === 0}
                onClick={() => move(index - 1)}
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                aria-label="Move recording down"
                disabled={index === tracks.length - 1}
                onClick={() => move(index + 1)}
              >
                <ArrowDown size={16} />
              </Button>
              <Button
                aria-label="Remove recording"
                onClick={() => {
                  const next = tracks.filter(
                    (track) => track.assetId !== current.assetId,
                  );
                  change(next);
                  setSelected(
                    next[Math.min(index, next.length - 1)]?.assetId ?? "",
                  );
                  if (!next.length) setAdding(true);
                }}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <p {...stylex.props(styles.empty)}>No recordings yet.</p>
      )}
      {Object.entries(errors).filter(([key]) => key.startsWith("config.tracks"))
        .length > 0 && (
        <p role="alert" {...stylex.props(styles.error)}>
          Check the title and artist for each recording.
        </p>
      )}
      <p {...stylex.props(styles.muted)}>
        Imports are saved to the audio library immediately. Playlist changes go
        live when you save the homepage. Removing a track keeps its audio in the
        library.
      </p>
      <details
        open={adding}
        onToggle={(event) => setAdding(event.currentTarget.open)}
        {...stylex.props(styles.importSection)}
      >
        <summary {...stylex.props(styles.importSummary)}>
          <Plus size={16} aria-hidden />
          Add recordings
        </summary>
        <div {...stylex.props(styles.importBody)}>
          <div {...stylex.props(styles.row)}>
            <input
              ref={upload}
              type="file"
              hidden
              accept=".mp3,.m4a,.wav,.flac"
              aria-label="Upload audio"
              disabled={library.busy}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void library.upload(file);
                event.target.value = "";
              }}
            />
            <Button
              disabled={library.busy}
              onClick={() => upload.current?.click()}
            >
              <Upload size={16} aria-hidden />
              Upload audio
            </Button>
            <span {...stylex.props(styles.muted)}>
              MP3, M4A, WAV, FLAC · 50 MiB · 15 min
            </span>
          </div>
          <div {...stylex.props(styles.importLink)}>
            <PaperField
              label="Direct audio URL"
              type="url"
              value={url}
              onValueChange={setUrl}
              disabled={library.busy}
            />
            <Button
              aria-label="Import URL"
              title="Import URL"
              disabled={!url || library.busy}
              onClick={() => void library.importUrl(url)}
            >
              <Link size={18} />
            </Button>
          </div>
          {library.busy && <Loading compact />}
          {library.notice && (
            <output {...stylex.props(styles.muted)}>{library.notice}</output>
          )}
          {library.unauthorized && (
            <a
              href="/auth"
              target="_blank"
              rel="noreferrer"
              {...stylex.props(styles.link)}
            >
              Sign in in a new tab
            </a>
          )}
          <h3 {...stylex.props(styles.sectionTitle)}>Audio library</h3>
          <ul {...stylex.props(styles.libraryList)}>
            {assets.map((recording) => {
              const included = tracks.some(
                (track) => track.assetId === recording.id,
              );
              return (
                <li key={recording.id} {...stylex.props(styles.libraryRow)}>
                  <div {...stylex.props(styles.recordSummary)}>
                    <span {...stylex.props(styles.passageSummary)}>
                      {recording.title || "Untitled recording"}
                    </span>
                    <span {...stylex.props(styles.muted)}>
                      {recording.artist}
                      {recording.duration
                        ? ` · ${recordingTime(recording.duration)}`
                        : ""}
                    </span>
                    {(recording.status !== "ready" ||
                      recording.spectrumStatus !== "ready") && (
                      <span {...stylex.props(styles.muted)}>
                        Audio {recording.status} · Spectrum{" "}
                        {recording.spectrumStatus}
                      </span>
                    )}
                    {recording.error && (
                      <span {...stylex.props(styles.error)}>
                        {recording.error}
                      </span>
                    )}
                  </div>
                  <div {...stylex.props(styles.row)}>
                    {(recording.status === "failed" ||
                      recording.status === "uploading" ||
                      recording.spectrumStatus === "failed") && (
                      <Button
                        aria-label={`Retry ${recording.title}`}
                        disabled={library.busy}
                        onClick={() => void library.retry(recording.id)}
                      >
                        <RefreshCw size={16} />
                      </Button>
                    )}
                    <Button
                      aria-label={`${included ? "Added" : "Add"} ${recording.title}`}
                      disabled={
                        included ||
                        recording.status !== "ready" ||
                        tracks.length >= 100
                      }
                      onClick={() => {
                        change([
                          ...tracks,
                          {
                            assetId: recording.id,
                            title: recording.title || "Untitled recording",
                            artist: recording.artist,
                          },
                        ]);
                        setSelected(recording.id);
                      }}
                    >
                      {included ? <Check size={16} /> : <Plus size={16} />}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </details>
    </>
  );
}
