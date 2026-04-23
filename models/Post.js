import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  coverImage: {
    type: String, // Store the URL of the blob
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  summary: {
    type: String,
  },
  tags: [{
    type: String,
    index: true,
  }],
  category: {
    type: String,
    index: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  published: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Ensure slugs are unique and clean
PostSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
