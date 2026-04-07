/* ── React hooks for UploadBox ─────────────────────────────────────────── */
import { useState, useRef, useEffect } from 'react';

/* ── Design tokens ─────────────────────────────────────────────────────── */
export const Y      = '#FFC107';
export const YL     = '#FFF8E1';
export const YD     = '#F59E0B';
export const BORDER = '#E5E7EB';
export const TEXT   = '#111827';
export const MUTED  = '#6B7280';
export const SANS   = "'Inter','Segoe UI',system-ui,sans-serif";
export const BG     = '#F9FAFB';

/* ── Layout ────────────────────────────────────────────────────────────── */
export const Card = ({ children, style, noPad }) => (
  <div style={{ background:'#fff', border:`1px solid ${BORDER}`, borderRadius:12,
    padding:noPad?0:'1.25rem', overflow:noPad?'hidden':undefined, ...style }}>
    {children}
  </div>
);

export const PageHeader = ({ title, subtitle, actions }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
    flexWrap:'wrap', gap:10, marginBottom:'1.25rem' }}>
    <div style={{ flex: '1 1 auto', minWidth: 0 }}>
      <h1 style={{ fontSize:'1.2rem', fontWeight:700, color:TEXT, margin:0, fontFamily:SANS }}>{title}</h1>
      {subtitle && <p style={{ fontSize:'0.82rem', color:MUTED, margin:'2px 0 0', fontFamily:SANS }}>{subtitle}</p>}
    </div>
    {actions && <div className="ph-actions" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>{actions}</div>}
  </div>
);

export const SectionTitle = ({ children, action }) => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
    <h3 style={{ fontSize:'0.92rem', fontWeight:700, color:TEXT, margin:0, fontFamily:SANS }}>{children}</h3>
    {action}
  </div>
);

/* ── Buttons ───────────────────────────────────────────────────────────── */
export const PrimaryBtn = ({ children, icon:Icon, small, style, onClick }) => (
  <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:6,
    padding:small?'6px 12px':'8px 16px', background:Y, border:'none', borderRadius:8,
    fontSize:small?'0.78rem':'0.85rem', fontWeight:600, color:'#fff', cursor:'pointer',
    fontFamily:SANS, whiteSpace:'nowrap', ...style }}>
    {Icon && <Icon size={small?13:15} />}{children}
  </button>
);

export const OutlineBtn = ({ children, icon:Icon, danger, small, onClick }) => (
  <button onClick={onClick} style={{ display:'inline-flex', alignItems:'center', gap:6,
    padding:small?'5px 10px':'7px 14px', background:'#fff',
    border:`1.5px solid ${danger?'#FCA5A5':BORDER}`, borderRadius:8,
    fontSize:small?'0.78rem':'0.85rem', fontWeight:500,
    color:danger?'#EF4444':MUTED, cursor:'pointer', fontFamily:SANS, whiteSpace:'nowrap' }}>
    {Icon && <Icon size={small?13:15} />}{children}
  </button>
);

export const IconBtn = ({ icon:Icon, color='#6B7280', title, bg }) => (
  <button title={title} style={{ padding:6, borderRadius:6, border:'none',
    background:bg||'transparent', cursor:'pointer', color,
    display:'inline-flex', alignItems:'center', justifyContent:'center' }}
    onMouseEnter={e=>e.currentTarget.style.background=bg||'#F3F4F6'}
    onMouseLeave={e=>e.currentTarget.style.background=bg||'transparent'}>
    <Icon size={14} />
  </button>
);

/* ── Badges ────────────────────────────────────────────────────────────── */
export const Badge = ({ status }) => {
  const map = {
    Active:   {bg:'#D1FAE5',color:'#065F46'},
    Inactive: {bg:'#F3F4F6',color:MUTED},
    Draft:    {bg:'#FEF3C7',color:'#92400E'},
    Premium:  {bg:'#EDE9FE',color:'#5B21B6'},
    Free:     {bg:'#DBEAFE',color:'#1E40AF'},
    Pending:  {bg:'#FEF3C7',color:'#92400E'},
    Cancelled:{bg:'#FEE2E2',color:'#991B1B'},
  };
  const s = map[status]||{bg:'#F3F4F6',color:MUTED};
  return <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:20,
    fontSize:'0.72rem', fontWeight:600, background:s.bg, color:s.color, fontFamily:SANS }}>{status}</span>;
};

/* ── Toggle (Active/Inactive switch UI) ────────────────────────────────── */
export const Toggle = ({ active }) => (
  <div title={active?'Active — click to deactivate':'Inactive — click to activate'}
    style={{ width:36, height:20, borderRadius:10, background:active?Y:'#E5E7EB',
      position:'relative', cursor:'pointer', flexShrink:0 }}>
    <div style={{ position:'absolute', top:2, left:active?18:2, width:16, height:16,
      borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)',
      transition:'left .15s' }} />
  </div>
);

/* ── Form inputs ───────────────────────────────────────────────────────── */
export const Input = ({ label, placeholder, type='text', required, hint }) => (
  <div style={{ marginBottom:'1rem' }}>
    {label && <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600,
      color:TEXT, marginBottom:5, fontFamily:SANS }}>
      {label}{required&&<span style={{color:'#EF4444'}}> *</span>}
    </label>}
    <input type={type} placeholder={placeholder}
      style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${BORDER}`,
        borderRadius:8, fontSize:'0.88rem', color:TEXT, background:'#fff',
        outline:'none', fontFamily:SANS, boxSizing:'border-box' }}
      onFocus={e=>e.target.style.borderColor=Y}
      onBlur={e=>e.target.style.borderColor=BORDER} />
    {hint && <p style={{ fontSize:'0.72rem', color:MUTED, margin:'3px 0 0', fontFamily:SANS }}>{hint}</p>}
  </div>
);

export const Textarea = ({ label, placeholder, rows=4 }) => (
  <div style={{ marginBottom:'1rem' }}>
    {label && <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600,
      color:TEXT, marginBottom:5, fontFamily:SANS }}>{label}</label>}
    <textarea placeholder={placeholder} rows={rows}
      style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${BORDER}`,
        borderRadius:8, fontSize:'0.88rem', color:TEXT, background:'#fff',
        outline:'none', fontFamily:SANS, resize:'vertical', boxSizing:'border-box' }}
      onFocus={e=>e.target.style.borderColor=Y}
      onBlur={e=>e.target.style.borderColor=BORDER} />
  </div>
);

export const Select = ({ label, options, required }) => (
  <div style={{ marginBottom:'1rem' }}>
    {label && <label style={{ display:'block', fontSize:'0.82rem', fontWeight:600,
      color:TEXT, marginBottom:5, fontFamily:SANS }}>
      {label}{required&&<span style={{color:'#EF4444'}}> *</span>}
    </label>}
    <select style={{ width:'100%', padding:'9px 12px', border:`1.5px solid ${BORDER}`,
      borderRadius:8, fontSize:'0.88rem', color:TEXT, background:'#fff',
      outline:'none', fontFamily:SANS, boxSizing:'border-box', cursor:'pointer' }}>
      <option value="">— Select —</option>
      {options.map(o=><option key={o}>{o}</option>)}
    </select>
  </div>
);

/**
 * UploadBox Component
 * Enhanced file upload component with loading, success, and error states
 * 
 * @param {Object} props
 * @param {string} props.label - Label text
 * @param {string} props.accept - Accepted file types (e.g., "audio/mp3,image/png")
 * @param {boolean} props.required - Whether field is required
 * @param {string} props.preset - Upload preset (image, audio, video, document)
 * @param {Function} props.onUpload - Callback with upload result { url, metadata }
 * @param {Function} props.onRemove - Callback when file is removed
 * @param {Object} props.value - Current uploaded value { url, metadata }
 * @param {Function} props.uploadService - Custom upload function (optional)
 */
export const UploadBox = ({ 
  label, 
  accept, 
  required, 
  preset = 'default',
  onUpload,
  onRemove,
  value,
  uploadService,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Reset state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setUploadedFile(value);
    }
  }, [value]);

  // Default upload function using the service
  const handleUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);

    try {
      let result;
      
      if (uploadService) {
        // Use custom upload service if provided
        result = await uploadService(file, {
          preset,
          onProgress: setUploadProgress,
        });
      } else {
        // Use default upload service
        const { uploadFile } = await import('../../services/uploadService');
        result = await uploadFile(file, {
          preset,
          onProgress: setUploadProgress,
        });
      }

      const uploadResult = {
        url: result.url,
        metadata: result.metadata,
        publicId: result.publicId,
      };

      setUploadedFile(uploadResult);
      onUpload?.(uploadResult);
    } catch (error) {
      const errorMessage = error.message || 'Upload failed';
      setUploadError(errorMessage);
      onUpload?.({ error: errorMessage });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    setUploadError(null);
    onRemove?.();
  };

  // Success state - show uploaded file
  if (uploadedFile && !isUploading) {
    const isImage = uploadedFile.metadata?.category === 'image';
    
    return (
      <div style={{ marginBottom: '1rem' }}>
        {label && (
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600,
            color: TEXT, marginBottom: 5, fontFamily: SANS }}>
            {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
          </label>
        )}
        <div style={{ 
          border: `2px solid ${isImage ? '#10B981' : BORDER}`, 
          borderRadius: 10, 
          padding: '0.75rem',
          background: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          {isImage ? (
            <img 
              src={uploadedFile.url} 
              alt="Uploaded" 
              style={{ 
                width: 48, 
                height: 48, 
                borderRadius: 6, 
                objectFit: 'cover',
                flexShrink: 0
              }} 
            />
          ) : (
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 6, 
              background: YL,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0
            }}>
              {uploadedFile.metadata?.category === 'audio' ? '🎵' : '📄'}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ 
              fontSize: '0.82rem', 
              color: TEXT, 
              margin: 0, 
              fontFamily: SANS,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {uploadedFile.metadata?.originalName || 'Uploaded file'}
            </p>
            {uploadedFile.metadata?.sizeFormatted && (
              <p style={{ 
                fontSize: '0.72rem', 
                color: MUTED, 
                margin: '2px 0 0',
                fontFamily: SANS 
              }}>
                {uploadedFile.metadata.sizeFormatted}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <span style={{ 
              fontSize: '0.72rem', 
              color: '#10B981',
              fontWeight: 600
            }}>
              ✓ Uploaded
            </span>
            <button
              onClick={handleRemove}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#EF4444',
                fontSize: '1rem',
                padding: '0.25rem',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Remove file"
            >
              ×
            </button>
          </div>
        </div>
        {/* Hidden file input for re-upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  // Loading state
  if (isUploading) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        {label && (
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600,
            color: TEXT, marginBottom: 5, fontFamily: SANS }}>
            {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
          </label>
        )}
        <div style={{ 
          border: `2px dashed ${Y}`, 
          borderRadius: 10, 
          padding: '1.5rem',
          background: YL,
          textAlign: 'center'
        }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid #E5E7EB',
            borderTop: `3px solid ${Y}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 0.75rem'
          }} />
          <p style={{ fontSize: '0.88rem', color: TEXT, margin: '0 0 0.5rem', fontFamily: SANS }}>
            Uploading...
          </p>
          <div style={{ 
            width: '100%', 
            height: 6, 
            background: '#E5E7EB', 
            borderRadius: 3,
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${uploadProgress}%`, 
              height: '100%', 
              background: Y,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ fontSize: '0.72rem', color: MUTED, margin: '0.5rem 0 0', fontFamily: SANS }}>
            {Math.round(uploadProgress)}% complete
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Error state
  if (uploadError) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        {label && (
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600,
            color: TEXT, marginBottom: 5, fontFamily: SANS }}>
            {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
          </label>
        )}
        <div style={{ 
          border: '2px dashed #FCA5A5', 
          borderRadius: 10, 
          padding: '1.25rem',
          background: '#FEF2F2',
          textAlign: 'center',
          cursor: 'pointer'
        }}
          onClick={handleClick}>
          <p style={{ fontSize: '0.82rem', color: '#EF4444', margin: '0 0 0.25rem', fontFamily: SANS }}>
            Upload failed: {uploadError}
          </p>
          <p style={{ fontSize: '0.72rem', color: MUTED, margin: 0, fontFamily: SANS }}>
            Click to try again
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  // Default / Drag state
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600,
          color: TEXT, marginBottom: 5, fontFamily: SANS }}>
          {label}{required && <span style={{ color: '#EF4444' }}> *</span>}
        </label>
      )}
      <div 
        style={{ 
          border: `2px dashed ${isDragging ? Y : BORDER}`, 
          borderRadius: 10, 
          padding: '1.25rem',
          textAlign: 'center', 
          cursor: 'pointer', 
          background: isDragging ? YL : '#FAFAFA',
          transition: 'all 0.2s ease'
        }}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}>
        <p style={{ fontSize: '0.82rem', color: isDragging ? Y : MUTED, margin: 0, fontFamily: SANS }}>
          {isDragging ? 'Drop file here' : 'Click to upload or drag & drop'}
        </p>
        <p style={{ fontSize: '0.72rem', color: '#9CA3AF', margin: '3px 0 0', fontFamily: SANS }}>
          {accept}
        </p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
    </div>
  );
};

/* ── Search + filter toolbar ───────────────────────────────────────────── */
export const Toolbar = ({ searchPlaceholder, filters, sortOptions }) => (
  <div className="toolbar-row">
    <div style={{ position:'relative', flex:'1 1 160px', minWidth:140, maxWidth: '100%' }}>
      <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)',
        color:MUTED, fontSize:14, pointerEvents:'none' }}>🔍</span>
      <input placeholder={searchPlaceholder||'Search...'} style={{ width:'100%',
        padding:'7px 10px 7px 30px', border:`1.5px solid ${BORDER}`, borderRadius:8,
        fontSize:'0.85rem', color:TEXT, background:'#F9FAFB', outline:'none',
        fontFamily:SANS, boxSizing:'border-box' }}
        onFocus={e=>{e.target.style.borderColor=Y;e.target.style.background='#fff';}}
        onBlur={e=>{e.target.style.borderColor=BORDER;e.target.style.background='#F9FAFB';}} />
    </div>
    {filters && (
      <select style={{ padding:'7px 10px', border:`1.5px solid ${BORDER}`, borderRadius:8,
        fontSize:'0.82rem', color:TEXT, background:'#fff', outline:'none',
        fontFamily:SANS, cursor:'pointer', minWidth:120, boxSizing:'border-box' }}>
        <option>All Status</option>
        {filters.map(f=><option key={f}>{f}</option>)}
      </select>
    )}
    {sortOptions && (
      <select style={{ padding:'7px 10px', border:`1.5px solid ${BORDER}`, borderRadius:8,
        fontSize:'0.82rem', color:TEXT, background:'#fff', outline:'none',
        fontFamily:SANS, cursor:'pointer', minWidth:120, boxSizing:'border-box' }}>
        <option>Sort by</option>
        {sortOptions.map(s=><option key={s}>{s}</option>)}
      </select>
    )}
  </div>
);

/* ── Inline trash icon for bulk ────────────────────────────────────────── */
const TrashIcon = ({size=13}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

/* ── Table ─────────────────────────────────────────────────────────────── */
export const Table = ({ headers, rows, checkable }) => (
  <div className="tbl-wrap">
    <table style={{ borderCollapse:'collapse', fontFamily:SANS, fontSize:'0.85rem' }}>
      <thead>
        <tr style={{ background:'#F9FAFB' }}>
          {checkable && (
            <th style={{ padding:'9px 14px', width:36 }}>
              <input type="checkbox" style={{ cursor:'pointer' }} />
            </th>
          )}
          {headers.map(h => (
            <th key={h} style={{ padding:'9px 14px', textAlign:'left', fontSize:'0.72rem',
              fontWeight:600, color:MUTED, textTransform:'uppercase',
              letterSpacing:'0.06em', whiteSpace:'nowrap', userSelect:'none', cursor:'pointer' }}>
              {h} <span style={{ color:'#D1D5DB' }}>↕</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderTop:`1px solid ${BORDER}` }}
            onMouseEnter={e=>e.currentTarget.style.background='#FAFAFA'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            {checkable && (
              <td style={{ padding:'10px 14px' }}>
                <input type="checkbox" style={{ cursor:'pointer' }} />
              </td>
            )}
            {row.map((cell, j) => (
              <td key={j} style={{ padding:'10px 14px', color:TEXT, whiteSpace:'nowrap' }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ── Pagination ────────────────────────────────────────────────────────── */
export const Pagination = ({ label='Showing 1–10 of 0' }) => (
  <div className="pg-row">
    <span style={{ fontSize:'0.78rem', color:MUTED, fontFamily:SANS }}>{label}</span>
    <div className="pg-btns">
      {['«','‹','1','2','3','›','»'].map(p => (
        <button key={p} style={{ padding:'4px 9px', borderRadius:6,
          border:`1px solid ${p==='1'?Y:BORDER}`, background:p==='1'?Y:'#fff',
          color:p==='1'?'#fff':MUTED, fontSize:'0.78rem', cursor:'pointer',
          fontFamily:SANS, minWidth:28 }}>{p}</button>
      ))}
    </div>
  </div>
);

/* ── Modal shell ───────────────────────────────────────────────────────── */
export const Modal = ({ title, children, onClose, wide }) => (
  <div className="adm-modal-wrap" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
    zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
    <div className="adm-modal-inner" style={{ background:'#fff', borderRadius:14, width:'100%',
      maxWidth:wide?680:480, maxHeight:'92vh', overflowY:'auto', fontFamily:SANS }}>
      <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${BORDER}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'sticky', top:0, background:'#fff', zIndex:1 }}>
        <h2 style={{ fontSize:'1rem', fontWeight:700, color:TEXT, margin:0 }}>{title}</h2>
        <button onClick={onClose} style={{ background:'none', border:'none',
          cursor:'pointer', color:MUTED, fontSize:'1.3rem', lineHeight:1, padding:'0 4px' }}>×</button>
      </div>
      <div style={{ padding:'1.25rem' }}>{children}</div>
    </div>
  </div>
);

export const FormGrid = ({ children }) => (
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}
    className="form-2col">{children}</div>
);

export const FormActions = ({ submitLabel='Save', onCancel }) => (
  <div style={{ display:'flex', gap:10, marginTop:'0.5rem', paddingTop:'1rem',
    borderTop:`1px solid ${BORDER}` }}>
    <PrimaryBtn>{submitLabel}</PrimaryBtn>
    <OutlineBtn>Cancel</OutlineBtn>
  </div>
);

/* ── Row action group ──────────────────────────────────────────────────── */
export const RowActions = ({ onView, onEdit, onDelete, active }) => (
  <div style={{ display:'flex', gap:2, alignItems:'center', flexWrap:'nowrap' }}>
    <IconBtn icon={EyeIcon}   color="#3B82F6" title="View"   />
    <IconBtn icon={EditIcon}  color="#10B981" title="Edit"   />
    <IconBtn icon={TrashIcon} color="#EF4444" title="Delete" />
    <Toggle active={active} />
  </div>
);

/* ── Inline SVG icons (no dependency) ─────────────────────────────────── */
const EyeIcon = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EditIcon = ({size=14}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

/* ── Skeleton row (placeholder) ────────────────────────────────────────── */
export const SkeletonRows = ({ cols=5, rows=5, checkable }) => (
  <>
    {Array.from({length:rows}).map((_,i) => (
      <tr key={i} style={{ borderTop:`1px solid ${BORDER}` }}>
        {checkable && <td style={{ padding:'10px 14px' }}><div style={{ width:16,height:16,background:'#F3F4F6',borderRadius:3 }} /></td>}
        {Array.from({length:cols}).map((_,j) => (
          <td key={j} style={{ padding:'10px 14px' }}>
            <div style={{ height:12, width:`${60+Math.random()*40}%`, background:'#F3F4F6', borderRadius:4 }} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

/* ── Avatar ────────────────────────────────────────────────────────────── */
export const Avatar = ({ name, size=34 }) => (
  <div style={{ width:size, height:size, borderRadius:'50%', background:Y,
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    color:'#fff', fontWeight:700, fontSize:size*0.38, fontFamily:SANS }}>
    {name?name[0].toUpperCase():'?'}
  </div>
);

/* ── Cover placeholder ─────────────────────────────────────────────────── */
export const Cover = ({ size=36 }) => (
  <div style={{ width:size, height:size, borderRadius:8, background:YL,
    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    fontSize:size*0.45 }}>🎵</div>
);

/* ── Chart placeholder ─────────────────────────────────────────────────── */
export const ChartBox = ({ height=110, label }) => (
  <div style={{ height, background:'#F9FAFB', borderRadius:8,
    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4 }}>
    <span style={{ fontSize:'1.5rem' }}>📊</span>
    <span style={{ fontSize:'0.75rem', color:'#D1D5DB', fontFamily:SANS }}>{label||'Chart placeholder'}</span>
  </div>
);

/* ── Stat card ─────────────────────────────────────────────────────────── */
export const StatCard = ({ label, icon, color='#3B82F6', bg='#EFF6FF' }) => (
  <Card style={{ padding:'1.25rem' }}>
    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'0.75rem' }}>
      <div style={{ width:40, height:40, borderRadius:10, background:bg,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>
        {icon}
      </div>
      <div style={{ width:40, height:18, background:'#F3F4F6', borderRadius:20 }} />
    </div>
    <div style={{ width:60, height:22, background:'#F3F4F6', borderRadius:4, marginBottom:6 }} />
    <div style={{ fontSize:'0.78rem', color:MUTED, fontFamily:SANS }}>{label}</div>
  </Card>
);

export { TrashIcon, EyeIcon, EditIcon };
