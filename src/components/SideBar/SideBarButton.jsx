import { Link } from "react-router-dom";

const SideBarButton = ({ link, icon: Icon, name, bg, dark, text }) => {
  return (
    <Link to={link}>
      <button className="w-full text-left p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center space-x-3 transition-colors group">
        <div
          className={`p-2 ${bg} ${dark} rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors`}
        >
          <Icon size={20} className={`${text} dark:${text}`} />
        </div>
        <span className="font-medium">{name}</span>
      </button>
    </Link>
  );
};

export default SideBarButton;
