type Props = {
  previewUrl: string | null;
  filename?: string;
};

export const PlantPreview = ({ previewUrl, filename }: Props) => {
  if (!previewUrl) {
    return null;
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {filename && <p>Имя файла: {filename}</p>}
      <img
        src={previewUrl}
        alt="preview"
        style={{
          maxWidth: '300px',
          maxHeight: '300px',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
    </div>
  );
};
