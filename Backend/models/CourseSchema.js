import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

//  Lesson Schema 
const LessonSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, trim: true, index: true },
  description: { type: String },
  type: { type: String, enum: ['video', 'pdf', 'text'], required: true },
  videoUrl: { type: String },
  pdfUrl: { type: String },
  content: { type: String },
  thumbnailUrl: { type: String },
  duration: { type: String },
  position: { type: Number, default: 0 },
  isFreePreview: { type: Boolean, default: false },
  resources: [{ label: String, url: String }],
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

LessonSchema.pre("save", function (next) {
  if (!this.slug && this.title)
    this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

/* ------------------------- Module Schema ------------------------- */
const ModuleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, trim: true, index: true },
  description: { type: String },
  position: { type: Number, default: 0 },
  lessons: [LessonSchema],
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

ModuleSchema.pre("save", function (next) {
  if (!this.slug && this.title)
    this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

/* ------------------------- Instructor Subdocument ------------------------- */
const InstructorSchema = new Schema({
  name: { type: String},
  bio: { type: String },
  email: { type: String },
  socialLinks: {
    youtube: String,
    instagram: String,
    facebook: String,
    website: String
  }
}, { _id: false });

/* ------------------------- Review Schema ------------------------- */
const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  username: String,
  rating: { type: Number, min: 0, max: 5 },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

/* ------------------------- Course Schema ------------------------- */
const CourseSchema = new Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true, required: true, index: true },
  subtitle: { type: String },
  shortDescription: { type: String },
  description: { type: String },
  category: { type: String, index: true },
  tags: [{ type: String }],
  level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
  language: { type: String, default: "English" },
  thumbnailUrl: String,
  promoVideoUrl: String,
  price: { type: Number, default: 0 },
  currency: { type: String, default: "INR" },
  isFree: { type: Boolean, default: false },
  offerPrice: Number,
  duration: String,
  prerequisites: [String],
  whatYouWillLearn: [String],
  requirements: [String],
  modules: [ModuleSchema],
  instructor: InstructorSchema,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  stats: {
    enrolledStudents: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 }
  },
  reviews: [ReviewSchema],
  publish: {
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    publishedAt: Date
  },
  visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
  analytics: {
    views: { type: Number, default: 0 },
    completions: { type: Number, default: 0 }
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CourseSchema.pre("validate", function (next) {
  if (!this.slug && this.title)
    this.slug = slugify(this.title, { lower: true, strict: true });
  this.updatedAt = new Date();
  next();
});

/* ------------------------- Enrollment Schema ------------------------- */
const EnrollmentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  enrolledAt: { type: Date, default: Date.now },
  progress: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  purchasedPrice: Number,
  purchaseCurrency: String,
  coupon: { code: String, discount: Number },
  lastAccessedLesson: { type: Schema.Types.ObjectId }
}, { timestamps: true });

EnrollmentSchema.index({ course: 1, user: 1 }, { unique: true });

/* ------------------------- Progress Schema ------------------------- */
const ProgressSchema = new Schema({
  enrollment: { type: Schema.Types.ObjectId, ref: "Enrollment", required: true },
  lesson: { type: Schema.Types.ObjectId },
  completed: { type: Boolean, default: false },
  completedAt: Date,
  watchSeconds: { type: Number, default: 0 }
}, { timestamps: true });

/* ------------------------- Exports ------------------------- */
export const Course = mongoose.models.Course || mongoose.model("Course", CourseSchema);
export const Enrollment = mongoose.models.Enrollment || mongoose.model("Enrollment", EnrollmentSchema);
export const Progress = mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
