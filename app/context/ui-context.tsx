"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";

type CommentForm = {
  name?: string;
  email: string;
  comment: string;
};

type AppContextType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;

  collapsed: boolean;
  toggleCollapsed: () => void;

  search: string;
  setSearch: Dispatch<SetStateAction<string>>;

  category: string;
  setCategory: Dispatch<SetStateAction<string>>;

  commentForm: CommentForm;
  setCommentForm: Dispatch<SetStateAction<CommentForm>>;
};


const AppContext = createContext<AppContextType | null>(null);


type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({
  children,
}: AppProviderProps) {
  const [open, setOpen] = useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [commentForm, setCommentForm] =
    useState<CommentForm>({
      name: "",
      email: "",
      comment: "",
    });

  const [category, setCategory] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(
      "sidebar-collapsed"
    );

    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "sidebar-collapsed",
      String(collapsed)
    );
  }, [collapsed]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  const value: AppContextType = {
    open,
    setOpen,

    collapsed,
    toggleCollapsed,

    search,
    setSearch,

    category,
    setCategory,

    commentForm,
    setCommentForm,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}


export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useAppContext must be used within AppProvider"
    );
  }

  return context;
}

// Alias for administrative components
export const useSidebar = useAppContext;
export const SidebarProvider = AppProvider;