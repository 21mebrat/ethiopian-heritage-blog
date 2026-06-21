import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageBlock: {
      insertImageBlock: () => ReturnType;
    };
    videoBlock: {
      insertVideoBlock: () => ReturnType;
    };
    galleryBlock: {
      insertGalleryBlock: () => ReturnType;
    };
    calloutBlock: {
      insertCalloutBlock: () => ReturnType;
    };
    heroBlock: {
      insertHeroBlock: () => ReturnType;
    };
    mediaTextBlock: {
      insertMediaTextBlock: () => ReturnType;
    };
  }
}
