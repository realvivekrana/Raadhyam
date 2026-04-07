import { useState } from 'react';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, SkeletonRows, Pagination, Badge, RowActions, Cover, Modal, FormGrid, Input, Select, Textarea, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Song','Artist','Album','Genre','Duration','Status','Actions'];

/**
 * SongForm Component
 * Handles song creation/editing with integrated upload functionality
 */
const SongForm = ({ title, onClose, existingSong = null }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: existingSong?.title || '',
    artist: existingSong?.artist || '',
    album: existingSong?.album || '',
    genre: existingSong?.genre || '',
    duration: existingSong?.duration || '',
    language: existingSong?.language || '',
    status: existingSong?.status || 'Active',
    releaseDate: existingSong?.releaseDate || '',
    description: existingSong?.description || '',
  });

  // Upload state - stores the uploaded file URLs
  const [audioFile, setAudioFile] = useState(
    existingSong?.audioUrl ? { url: existingSong.audioUrl, metadata: { originalName: existingSong.audioFileName } } : null
  );
  const [coverImage, setCoverImage] = useState(
    existingSong?.coverUrl ? { url: existingSong.coverUrl, metadata: { originalName: existingSong.coverFileName, category: 'image' } } : null
  );

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle audio file upload completion
  const handleAudioUpload = (result) => {
    if (result.error) {
      setSubmitError(`Audio upload failed: ${result.error}`);
    } else {
      setAudioFile(result);
      setSubmitError(null);
    }
  };

  // Handle cover image upload completion
  const handleCoverUpload = (result) => {
    if (result.error) {
      setSubmitError(`Cover image upload failed: ${result.error}`);
    } else {
      setCoverImage(result);
      setSubmitError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      setSubmitError('Song title is required');
      return;
    }
    if (!formData.artist.trim()) {
      setSubmitError('Artist name is required');
      return;
    }
    if (!formData.genre) {
      setSubmitError('Genre is required');
      return;
    }
    if (!audioFile) {
      setSubmitError('Audio file is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for API call to /api/music
      const songData = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album,
        genre: formData.genre,
        duration: formData.duration,
        language: formData.language,
        status: formData.status,
        releaseDate: formData.releaseDate,
        description: formData.description,
        // Use the uploaded Cloudinary URLs
        audioUrl: audioFile.url,
        audioMetadata: audioFile.metadata,
        coverUrl: coverImage?.url,
        coverMetadata: coverImage?.metadata,
      };

      // Get auth token
      const token = localStorage.getItem('token');

      // Make API call
      const response = await fetch('http://localhost:5000/api/music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(songData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save song');
      }

      // Success - close modal
      console.log('Song saved successfully:', result);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Failed to save song');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <FormGrid>
        <Input 
          label="Song Title" 
          placeholder="e.g. Midnight Echoes" 
          required 
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        <Input 
          label="Artist Name" 
          placeholder="e.g. Luna Ray" 
          required 
          value={formData.artist}
          onChange={(e) => handleInputChange('artist', e.target.value)}
        />
        <Input 
          label="Album" 
          placeholder="e.g. Neon Dreams" 
          value={formData.album}
          onChange={(e) => handleInputChange('album', e.target.value)}
        />
        <Select 
          label="Genre" 
          options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave']} 
          required 
          value={formData.genre}
          onChange={(e) => handleInputChange('genre', e.target.value)}
        />
        <Input 
          label="Duration" 
          placeholder="e.g. 3:45" 
          value={formData.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)}
        />
        <Select 
          label="Language" 
          options={['English','Hindi','Spanish','French','Japanese']}
          value={formData.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
        />
        <Select 
          label="Status" 
          options={['Active','Inactive','Draft']}
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        />
        <Input 
          label="Release Date" 
          type="date" 
          value={formData.releaseDate}
          onChange={(e) => handleInputChange('releaseDate', e.target.value)}
        />
      </FormGrid>
      <Textarea 
        label="Description" 
        placeholder="Short description of the song..." 
        rows={3}
        value={formData.description}
        onChange={(e) => handleInputChange('description', e.target.value)}
      />

      {/* Audio File Upload - preset 'audio' */}
      <UploadBox 
        label="Audio File *" 
        accept="audio/mpeg,audio/wav,audio/ogg,audio/flac"
        preset="audio"
        required
        value={audioFile}
        onUpload={handleAudioUpload}
        onRemove={() => setAudioFile(null)}
      />

      {/* Cover Image Upload - preset 'image' */}
      <UploadBox 
        label="Cover Image" 
        accept="image/jpeg,image/png,image/webp"
        preset="image"
        value={coverImage}
        onUpload={handleCoverUpload}
        onRemove={() => setCoverImage(null)}
      />

      {/* Error message */}
      {submitError && (
        <div style={{ 
          padding: '0.75rem', 
          background: '#FEF2F2', 
          border: '1px solid #FCA5A5', 
          borderRadius: 8, 
          marginBottom: '1rem',
          color: '#EF4444',
          fontSize: '0.82rem'
        }}>
          {submitError}
        </div>
      )}

      {/* Form Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: '0.5rem', paddingTop: '1rem', borderTop: `1px solid ${BORDER}` }}>
        <PrimaryBtn onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Song'}
        </PrimaryBtn>
        <OutlineBtn onClick={onClose} disabled={isSubmitting}>Cancel</OutlineBtn>
      </div>

      <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
    </Modal>
  );
};

const SongsPage = () => {
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'view'
  const [selectedSong, setSelectedSong] = useState(null);

  const rows = Array.from({length:5}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <Cover size={34} />
      <div>
        <div style={{ width:100, height:11, background:'#F3F4F6', borderRadius:4, marginBottom:4 }} />
        <div style={{ width:70,  height:10, background:'#F3F4F6', borderRadius:4 }} />
      </div>
    </div>,
    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:90, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:60, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:40, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%3===2?'Inactive':i%3===1?'Draft':'Active'} />,
    <RowActions active={i%3!==2} onEdit={() => {
      setSelectedSong({ id: i, title: 'Sample Song' }); // Would fetch real data
      setModal('edit');
    }} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <SongForm title="Add New Song"  onClose={() => { setModal(null); setSelectedSong(null); }} />}
      {modal==='edit' && <SongForm title="Edit Song"     onClose={() => { setModal(null); setSelectedSong(null); }} existingSong={selectedSong} />}

      <PageHeader title="Songs" subtitle="Manage all songs"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={() => setModal('add')}>Add Song</PrimaryBtn>,
        ]} />

      <Card noPad>
        <Toolbar
          searchPlaceholder="Search by title, artist, album..."
          filters={['Active','Inactive','Draft']}
          sortOptions={['Title A–Z','Title Z–A','Newest','Oldest','Most Played']}
        />
        <Table headers={HEADERS} rows={rows} checkable />
        <Pagination label="Showing 1–10 of 0 songs" />
      </Card>
    </div>
  );
};

const PlusIcon = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default SongsPage;
