import { useState } from 'react';
import { Card, PageHeader, PrimaryBtn, OutlineBtn, Toolbar, Table, Pagination, Badge, RowActions, Modal, FormGrid, Input, Select, UploadBox, FormActions, SANS, TEXT, MUTED, BORDER, Y, YL } from '../components/UI';

const HEADERS = ['Album','Artist','Genre','Year','Tracks','Status','Actions'];

/**
 * AlbumForm Component
 * Handles album creation/editing with integrated cover image upload
 */
const AlbumForm = ({ title, onClose, existingAlbum = null }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: existingAlbum?.title || '',
    artist: existingAlbum?.artist || '',
    genre: existingAlbum?.genre || '',
    releaseYear: existingAlbum?.releaseYear || '',
    totalTracks: existingAlbum?.totalTracks || '',
    status: existingAlbum?.status || 'Active',
    label: existingAlbum?.label || '',
    upcCode: existingAlbum?.upcCode || '',
  });

  // Upload state - stores the uploaded cover image
  const [coverImage, setCoverImage] = useState(
    existingAlbum?.coverUrl 
      ? { url: existingAlbum.coverUrl, metadata: { originalName: existingAlbum.coverFileName, category: 'image' } } 
      : null
  );

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      setSubmitError('Album title is required');
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
    if (!coverImage) {
      setSubmitError('Album cover image is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare data for API call
      const albumData = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        releaseYear: formData.releaseYear,
        totalTracks: formData.totalTracks,
        status: formData.status,
        label: formData.label,
        upcCode: formData.upcCode,
        // Use the uploaded Cloudinary URL for cover
        coverUrl: coverImage.url,
        coverMetadata: coverImage.metadata,
      };

      // Get auth token
      const token = localStorage.getItem('token');

      // Determine if creating or updating
      const method = existingAlbum?.id ? 'PUT' : 'POST';
      const url = existingAlbum?.id 
        ? `http://localhost:5000/api/albums/${existingAlbum.id}` 
        : 'http://localhost:5000/api/albums';

      // Make API call
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(albumData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save album');
      }

      // Success - close modal
      console.log('Album saved successfully:', result);
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Failed to save album');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose} wide>
      <FormGrid>
        <Input 
          label="Album Title" 
          placeholder="e.g. Neon Dreams" 
          required 
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        <Input 
          label="Artist" 
          placeholder="e.g. Luna Ray" 
          required 
          value={formData.artist}
          onChange={(e) => handleInputChange('artist', e.target.value)}
        />
        <Select 
          label="Genre" 
          options={['Pop','Rock','Hip-Hop','Jazz','Classical','Electronic','R&B','Indie','Synthwave','J-Pop']} 
          required 
          value={formData.genre}
          onChange={(e) => handleInputChange('genre', e.target.value)}
        />
        <Input 
          label="Release Year" 
          placeholder="e.g. 2025" 
          value={formData.releaseYear}
          onChange={(e) => handleInputChange('releaseYear', e.target.value)}
        />
        <Input 
          label="Total Tracks" 
          placeholder="e.g. 12" 
          type="number" 
          value={formData.totalTracks}
          onChange={(e) => handleInputChange('totalTracks', e.target.value)}
        />
        <Select 
          label="Status" 
          options={['Active','Inactive','Draft']}
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
        />
        <Input 
          label="Label" 
          placeholder="Record label name" 
          value={formData.label}
          onChange={(e) => handleInputChange('label', e.target.value)}
        />
        <Input 
          label="UPC Code" 
          placeholder="Universal Product Code" 
          value={formData.upcCode}
          onChange={(e) => handleInputChange('upcCode', e.target.value)}
        />
      </FormGrid>

      {/* Album Cover Image Upload - preset 'image' */}
      <UploadBox 
        label="Album Cover *" 
        accept="image/jpeg,image/png,image/webp"
        preset="image"
        required
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
          {isSubmitting ? 'Saving...' : 'Save Album'}
        </PrimaryBtn>
        <OutlineBtn onClick={onClose} disabled={isSubmitting}>Cancel</OutlineBtn>
      </div>

      <style>{`.form-2col{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}@media(max-width:540px){.form-2col{grid-template-columns:1fr!important}}`}</style>
    </Modal>
  );
};

const AlbumsPage = () => {
  const [modal, setModal] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [view, setView] = useState('grid');

  const rows = Array.from({length:5}).map((_,i) => [
    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <div style={{ width:34, height:34, borderRadius:6, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>💿</div>
      <div style={{ width:100, height:11, background:'#F3F4F6', borderRadius:4 }} />
    </div>,
    <div style={{ width:80, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:60, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:40, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <div style={{ width:30, height:11, background:'#F3F4F6', borderRadius:4 }} />,
    <Badge status={i%4===3?'Inactive':i%4===2?'Draft':'Active'} />,
    <RowActions active={i%4!==3} onEdit={() => {
      setSelectedAlbum({ id: i, title: 'Sample Album' }); // Would fetch real data
      setModal('edit');
    }} />,
  ]);

  return (
    <div style={{ fontFamily:SANS }}>
      {modal==='add'  && <AlbumForm title="Add New Album" onClose={() => { setModal(null); setSelectedAlbum(null); }} />}
      {modal==='edit' && <AlbumForm title="Edit Album"    onClose={() => { setModal(null); setSelectedAlbum(null); }} existingAlbum={selectedAlbum} />}

      <PageHeader title="Albums" subtitle="Manage all albums"
        actions={[
          <OutlineBtn key="exp">⬇ Export</OutlineBtn>,
          <PrimaryBtn key="add" icon={PlusIcon} onClick={() => setModal('add')}>Add Album</PrimaryBtn>,
        ]} />

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
        <div className="view-toggle" style={{ display:'flex', gap:6 }}>
          {['Grid','Table'].map((v,i) => (
            <button key={v} onClick={()=>setView(v.toLowerCase())}
              style={{ padding:'6px 14px', borderRadius:8, border:`1.5px solid ${view===v.toLowerCase()?Y:BORDER}`, background:view===v.toLowerCase()?Y:'#fff', color:view===v.toLowerCase()?'#fff':MUTED, fontSize:'0.82rem', fontWeight:600, cursor:'pointer', fontFamily:SANS }}>{v}</button>
          ))}
        </div>
        {/* Inline search for grid */}
        {view==='grid' && (
          <div style={{ position:'relative', flex:'1 1 240px', minWidth: 200, maxWidth: '100%' }}>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:MUTED }}>🔍</span>
            <input placeholder="Search albums..." style={{ width:'100%', padding:'7px 10px 7px 30px', border:`1.5px solid ${BORDER}`, borderRadius:8, fontSize:'0.85rem', color:TEXT, background:'#F9FAFB', outline:'none', fontFamily:SANS, boxSizing:'border-box' }}
              onFocus={e=>{e.target.style.borderColor=Y;e.target.style.background='#fff';}}
              onBlur={e=>{e.target.style.borderColor=BORDER;e.target.style.background='#F9FAFB';}} />
          </div>
        )}
      </div>

      {view === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'1rem' }} className="album-grid">
          {Array.from({length:8}).map((_,i) => (
            <Card key={i} style={{ padding:0, overflow:'hidden' }}>
              <div style={{ height:140, background:YL, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>💿</div>
              <div style={{ padding:'0.9rem' }}>
                <div style={{ width:'80%', height:12, background:'#F3F4F6', borderRadius:4, marginBottom:6 }} />
                <div style={{ width:'60%', height:10, background:'#F3F4F6', borderRadius:4, marginBottom:6 }} />
                <div style={{ width:'40%', height:10, background:'#F3F4F6', borderRadius:4, marginBottom:10 }} />
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6 }}>
                  <Badge status={i%4===3?'Inactive':i%4===2?'Draft':'Active'} />
                  <RowActions active={i%4!==3} onEdit={() => {
                    setSelectedAlbum({ id: i, title: 'Sample Album' });
                    setModal('edit');
                  }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card noPad>
          <Toolbar
            searchPlaceholder="Search by title, artist..."
            filters={['Active','Inactive','Draft']}
            sortOptions={['Title A–Z','Title Z–A','Newest','Oldest','Most Tracks']}
          />
          <Table headers={HEADERS} rows={rows} checkable />
          <Pagination label="Showing 1–10 of 0 albums" />
        </Card>
      )}
      <style>{`
        .album-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:1rem; }
        @media(max-width:640px) { .album-grid { grid-template-columns:repeat(2,1fr); gap:0.75rem; } }
        @media(max-width:400px) { .album-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
};

const PlusIcon = ({size=15}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

export default AlbumsPage;
