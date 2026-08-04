import { useState, useMemo } from "react";
import { 
  FiFile, 
  FiFolder, 
  FiFolderMinus, 
  FiChevronRight, 
  FiCode, 
  FiFileText 
} from "react-icons/fi";
import { 
  SiJavascript, 
  SiTypescript, 
  SiCss, 
  SiHtml5, 
  SiJson, 
  SiMarkdown, 
  SiPython 
} from "react-icons/si";
import styles from "./FileTree.module.css";

// Helper to select file icon based on extension
const getFileIcon = (ext) => {
  const cleanExt = (ext || "").toLowerCase().replace(".", "");
  switch (cleanExt) {
    case "js":
    case "jsx":
      return <SiJavascript className={styles.jsIcon} />;
    case "ts":
    case "tsx":
      return <SiTypescript className={styles.cssIcon} />;
    case "css":
    case "scss":
      return <SiCss className={styles.cssIcon} />;
    case "html":
      return <SiHtml5 className={styles.htmlIcon} />;
    case "json":
      return <SiJson className={styles.jsonIcon} />;
    case "md":
      return <SiMarkdown className={styles.defaultIcon} />;
    case "py":
      return <SiPython className={styles.jsIcon} />;
    default:
      return <FiFile className={styles.defaultIcon} />;
  }
};

// Build tree structure from flat file paths
function buildTree(files) {
  const root = {};

  files.forEach((file) => {
    const parts = (file.file_path || file.file_name || "").split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      if (!current[part]) {
        current[part] = {
          name: part,
          isFolder: !isFile,
          fileData: isFile ? file : null,
          children: {}
        };
      }
      current = current[part].children;
    });
  });

  return root;
}

function TreeNode({ node, onSelect, selectedFile, depth = 0 }) {
  const [isOpen, setIsOpen] = useState(true);

  if (node.isFolder) {
    const childrenKeys = Object.keys(node.children);
    return (
      <div>
        <div 
          className={styles.item}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiChevronRight className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`} />
          {isOpen ? (
            <FiFolderMinus className={`${styles.icon} ${styles.folderIcon}`} />
          ) : (
            <FiFolder className={`${styles.icon} ${styles.folderIcon}`} />
          )}
          <span className={styles.fileName}>{node.name}</span>
        </div>
        {isOpen && (
          <div>
            {childrenKeys.map((key) => (
              <TreeNode
                key={key}
                node={node.children[key]}
                onSelect={onSelect}
                selectedFile={selectedFile}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const file = node.fileData;
  const isSelected = selectedFile?.file_id === file?.file_id || selectedFile?.file_path === file?.file_path;

  return (
    <div
      className={`${styles.item} ${isSelected ? styles.selected : ""}`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
      onClick={() => onSelect(file)}
    >
      <span className={styles.icon}>
        {getFileIcon(file?.file_extension || node.name.split(".").pop())}
      </span>
      <span className={styles.fileName}>{node.name}</span>
      {file?.size && file.size !== "0" && (
        <span className={styles.fileSize}>{file.size}</span>
      )}
    </div>
  );
}

function FileTree({ files = [], onSelect, selectedFile }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase();
    return files.filter(
      (f) =>
        (f.file_path || "").toLowerCase().includes(q) ||
        (f.file_name || "").toLowerCase().includes(q)
    );
  }, [files, searchQuery]);

  const tree = useMemo(() => buildTree(filteredFiles), [filteredFiles]);
  const rootKeys = Object.keys(tree);

  return (
    <div className={styles.treeContainer}>
      <div className={styles.treeHeader}>
        <span className={styles.treeTitle}>Explorer</span>
        <span className={styles.fileCount}>{filteredFiles.length} files</span>
      </div>

      <div style={{ marginBottom: "10px", padding: "0 2px" }}>
        <input
          type="text"
          placeholder="Filter files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            background: "#0f1117",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "6px 10px",
            color: "#ffffff",
            fontSize: "12px",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </div>

      <div className={styles.treeList}>
        {rootKeys.length === 0 ? (
          <div style={{ color: "#6b7280", fontSize: "13px", padding: "12px" }}>
            {searchQuery ? "No matching files found." : "No files found in repository."}
          </div>
        ) : (
          rootKeys.map((key) => (
            <TreeNode
              key={key}
              node={tree[key]}
              onSelect={onSelect}
              selectedFile={selectedFile}
              depth={0}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FileTree;
