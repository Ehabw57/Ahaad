<!DOCTYPE html><html class="h-full" dir="rtl" lang="ar"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>آحاد | دليل الأدوات الرقمية البسيطة والعملية</title>
<!-- IBM Plex Sans Arabic Font -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet">
<!-- Material Symbols Outlined -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            nordic: {
              bg: '#f8fafb',
              card: '#ffffff',
              border: '#e6ebf0',
              'border-subtle': '#edf2f6',
              charcoal: '#111827',
              muted: '#5b6777',
              dim: '#8f9ba8',
              accent: '#1e3a5f',
              'accent-soft': '#eff4fa',
              'sage-tint': '#f0f5f3',
              'sage-text': '#1b4332'
            }
          },
          fontFamily: {
            sans: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
            arabic: ['"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif']
          },
          boxShadow: {
            'bento': '0 1px 3px rgba(17, 24, 39, 0.02), 0 6px 16px -4px rgba(17, 24, 39, 0.04)',
            'bento-hover': '0 4px 6px -1px rgba(17, 24, 39, 0.04), 0 12px 24px -4px rgba(17, 24, 39, 0.07)',
            'search': '0 2px 8px -2px rgba(17, 24, 39, 0.04), 0 8px 20px -4px rgba(17, 24, 39, 0.05)'
          }
        }
      }
    }
  </script>
<style>
    body {
      font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif;
      background-color: #f8fafb;
    }
    .material-symbols-outlined {
      font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    }
    /* Hide scrollbar for category pills navigation */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>
</head>
<body class="bg-nordic-bg text-nordic-charcoal min-h-screen flex flex-col antialiased selection:bg-nordic-accent-soft selection:text-nordic-accent">
<!-- Shared App Shell Container -->
<div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
<div class="layout-container flex h-full grow flex-col">
<div class="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 flex flex-1 justify-center py-5 sm:py-7">
<div class="layout-content-container flex flex-col max-w-[1140px] w-full flex-1">
<!-- Header Structure -->
<header class="flex items-center justify-between whitespace-nowrap border-b border-nordic-border/70 px-4 sm:px-6 py-4 mb-2">
<div class="flex items-center gap-3 sm:gap-3.5 text-nordic-charcoal">
<div class="size-7 text-nordic-charcoal flex items-center justify-center">
<svg class="w-6 h-6" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path clip-rule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fill-rule="evenodd"></path>
<path clip-rule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fill-rule="evenodd"></path>
</svg>
</div>
<h2 class="text-nordic-charcoal text-xl font-bold tracking-tight">آحاد</h2>
</div>
<div class="flex flex-1 justify-end items-center gap-4 sm:gap-8">
<nav class="hidden md:flex items-center gap-8">
<a class="text-nordic-charcoal font-semibold text-sm transition-colors" href="#">الرئيسية</a>
<a class="text-nordic-muted hover:text-nordic-charcoal text-sm font-medium transition-colors" href="#categories">التصنيفات</a>
<a class="text-nordic-muted hover:text-nordic-charcoal text-sm font-medium transition-colors" href="#">المفضلة</a>
<a class="text-nordic-muted hover:text-nordic-charcoal text-sm font-medium transition-colors" href="#">عن المنصة</a>
</nav>
<div class="flex items-center gap-2.5">
<button aria-label="تغيير المظهر" class="flex cursor-pointer items-center justify-center rounded-xl h-9 w-9 bg-nordic-card hover:bg-nordic-border-subtle text-nordic-charcoal border border-nordic-border shadow-xs transition-colors" id="themeToggleBtn">
<div class="text-nordic-charcoal" data-icon="Moon" data-size="18px" data-weight="regular">
<svg fill="currentColor" height="18px" viewBox="0 0 256 256" width="18px" xmlns="http://www.w3.org/2000/svg">
<path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"></path>
</svg>
</div>
</button>
<button aria-label="المحفوظات والمفضلة" class="flex cursor-pointer items-center justify-center rounded-xl h-9 w-9 bg-nordic-card hover:bg-nordic-border-subtle text-nordic-charcoal border border-nordic-border shadow-xs transition-colors">
<div class="text-nordic-charcoal" data-icon="Bookmark" data-size="18px" data-weight="regular">
<svg fill="currentColor" height="18px" viewBox="0 0 256 256" width="18px" xmlns="http://www.w3.org/2000/svg">
<path d="M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,16V161.57l-51.77-32.35a8,8,0,0,0-8.48,0L72,161.56V48ZM132.23,177.22a8,8,0,0,0-8.48,0L72,209.57V180.43l56-35,56,35v29.14Z"></path>
</svg>
</div>
</button>
</div>
</div>
</header>
<!-- 1. Hero Introduction & Prominent Search Area -->
<section class="pt-12 pb-7 px-2 text-center max-w-2xl mx-auto w-full">
<h1 class="text-nordic-charcoal tracking-tight text-3xl sm:text-4xl font-bold leading-tight pb-3">
              أدوات عملية وبسيطة، في مكان واحد
            </h1>
<p class="text-nordic-muted text-sm sm:text-base font-normal leading-relaxed pb-7 text-center">
              مجموعة أدوات مفيدة وسريعة، مُصممة للتركيز والعمل المباشر دون تعقيد.
            </p>
<!-- Search Bar Container with Soft Floating Pill Bento Touch -->
<div class="relative w-full text-right">
<label class="sr-only" for="toolSearchInput">ابحث عن أداة</label>
<div class="relative flex items-center w-full h-14 rounded-2xl border border-nordic-border bg-nordic-card focus-within:border-nordic-accent/70 focus-within:ring-2 focus-within:ring-nordic-accent/10 transition-all shadow-search">
<!-- Search Icon -->
<div class="flex items-center justify-center pr-4 pl-2 text-nordic-dim pointer-events-none">
<span class="material-symbols-outlined text-[22px]">search</span>
</div>
<!-- Input Field -->
<input autocomplete="off" class="w-full h-full bg-transparent border-0 text-nordic-charcoal placeholder:text-nordic-dim text-sm sm:text-base font-normal focus:ring-0 focus:outline-none pr-1 pl-20" id="toolSearchInput" placeholder="ابحث عن أداة... (مثلاً: تنزيل، دمج، ترقية، تأمين، عزل)" type="text">
<!-- Right Side Controls: Clear Button & Shortcut Badge -->
<div class="absolute left-3.5 flex items-center gap-2">
<button aria-label="مسح البحث" class="hidden p-1 text-nordic-dim hover:text-nordic-charcoal rounded-md transition-colors" id="searchClearBtn" type="button">
<span class="material-symbols-outlined text-[18px]">close</span>
</button>
<kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] text-nordic-muted font-medium bg-nordic-bg border border-nordic-border rounded-lg shadow-2xs">
                    ESC
                  </kbd>
</div>
</div>
</div>
</section>
<!-- 2. Horizontal Category Filter Pills -->
<section class="px-2 pt-2 pb-6" id="categories">
<div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
<button class="category-btn shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all bg-nordic-charcoal text-white shadow-xs border border-nordic-charcoal" data-category="all" type="button">
                الكل
              </button>
<button class="category-btn shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all bg-nordic-card text-nordic-muted hover:text-nordic-charcoal hover:bg-white border border-nordic-border hover:border-nordic-dim/40 shadow-xs" data-category="الحسابات" type="button">
                الحسابات
              </button>
<button class="category-btn shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all bg-nordic-card text-nordic-muted hover:text-nordic-charcoal hover:bg-white border border-nordic-border hover:border-nordic-dim/40 shadow-xs" data-category="النصوص" type="button">
                النصوص
              </button>
<button class="category-btn shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all bg-nordic-card text-nordic-muted hover:text-nordic-charcoal hover:bg-white border border-nordic-border hover:border-nordic-dim/40 shadow-xs" data-category="التاريخ والوقت" type="button">
                التاريخ والوقت
              </button>
<button class="category-btn shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all bg-nordic-card text-nordic-muted hover:text-nordic-charcoal hover:bg-white border border-nordic-border hover:border-nordic-dim/40 shadow-xs" data-category="الصور" type="button">
                الصور
              </button>
<button class="category-btn shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all bg-nordic-card text-nordic-muted hover:text-nordic-charcoal hover:bg-white border border-nordic-border hover:border-nordic-dim/40 shadow-xs" data-category="التحويلات" type="button">
                التحويلات
              </button>
<button class="category-btn shrink-0 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all bg-nordic-card text-nordic-muted hover:text-nordic-charcoal hover:bg-white border border-nordic-border hover:border-nordic-dim/40 shadow-xs" data-category="الأمان والتطوير" type="button">
                الأمان والتطوير
              </button>
</div>
<!-- Dynamic Result Counter bar -->
<div class="flex items-center justify-between text-xs text-nordic-dim px-1 pt-3 pb-1">
<span id="resultsCount" class="">عرض 16 أداة</span>
<span class="text-[11px] text-nordic-dim">تحديث فوري ومباشر</span>
</div>
</section>
<!-- 3. Tools Bento Grid -->
<main class="px-2 pb-16">
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-5" id="toolsGrid"><!-- Tool 1: تنزيل -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الصور" data-name="تنزيل تحميل المقاطع من مختلف الروابط بجودات متعددة video downloader" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">download</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">تنزيل</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">تحميل المقاطع من مختلف الروابط بجودات متعددة وبنقرة واحدة.</p>
</a>
<!-- Tool 2: تقطيع -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الصور" data-name="تقطيع قص وضبط أبعاد وإطارات الفيديو بدقة trimmer video crop" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">content_cut</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">تقطيع</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">قص وضبط أبعاد وإطارات الفيديو وتحديد المقاطع بدقة متناهية.</p>
</a>
<!-- Tool 3: دمج -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="التحويلات" data-name="دمج دمج وتنسيق ملفات المستندات في ملف واحد pdf merger" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">layers</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">دمج</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">دمج وترتيب ملفات المستندات المتعددة في ملف PDF واحد متكامل.</p>
</a>
<!-- Tool 4: ترميز -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الأمان والتطوير" data-name="ترميز توليد رموز الاستجابة السريعة وتخصيصها qr code generator" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">qr_code_2</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">ترميز</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">توليد رموز الاستجابة السريعة المخصصة للشفرات والروابط والبطاقات.</p>
</a>
<!-- Tool 5: ترقية -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الصور" data-name="ترقية رفع دقة وتحسين جودة الصور عبر المعالجة الذكية image upscale ai" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">auto_awesome</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">ترقية</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">رفع دقة وتحسين جودة وتفاصيل الصور عبر المعالجة الذكية.</p>
</a>
<!-- Tool 6: ضغط -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الصور" data-name="ضغط تقليص أحجام الصور والفيديو مع الحفاظ على النقاوة compressor" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">compress</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">ضغط</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">تقليص أحجام ملفات الصور والفيديو بكفاءة مع الحفاظ التام على النقاوة.</p>
</a>
<!-- Tool 7: تحويل -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="التحويلات" data-name="تحويل تحويل الصيغ بين المستندات والصوتيات والمرئيات universal converter" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">sync_alt</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">تحويل</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">تحويل شامل بين صيغ المستندات والملفات الصوتية والمرئية فوراً.</p>
</a>
<!-- Tool 8: تدقيق -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="النصوص" data-name="تدقيق تصحيح وتشكيل وتنسيق النصوص باحترافية proofreading text format" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">spellcheck</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">تدقيق</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">تصحيح الأخطاء اللغوية وتشكيل وتنسيق النصوص باحترافية وسلاسة.</p>
</a>
<!-- Tool 9: تفكيك -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الأمان والتطوير" data-name="تفكيك تحليل وتنسيق ومعاينة كتل البيانات وهياكلها json inspector parser" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">code_blocks</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">تفكيك</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">تحليل وتنسيق وفحص كتل JSON وهياكل البيانات البرمجية المعقدة.</p>
</a>
<!-- Tool 10: تأمين -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الأمان والتطوير" data-name="تأمين توليد وإدارة مفاتيح الأمان والكلمات المشفرة cipher password security" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">shield_lock</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">تأمين</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">توليد وإدارة مفاتيح التشفير وكلمات المرور المنيعة وحساب قوتها.</p>
</a>
<!-- Tool 11: عزل -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الصور" data-name="عزل إزالة وتفريغ خلفيات الصور تلقائياً بدقة background remover cut" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">face_retouching_natural</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">عزل</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">إزالة وتفريغ خلفيات الصور بدقة فائقة وبشكل فوري وتلقائي.</p>
</a>
<!-- Tool 12: توقيع -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="التحويلات" data-name="توقيع توقيع المستندات وإضافة الأختام الرقمية الموثقة digital signature pdf" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">draw</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">توقيع</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">توقيع المستندات وإضافة الأختام الرقمية والتواريخ الموثوقة بأمان.</p>
</a>
<!-- Tool 13: استخلاص -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="النصوص" data-name="استخلاص استخراج النصوص والأصوات من الوسائط المتعددة ocr audio text extract" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">document_scanner</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">استخلاص</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">استخراج النصوص من الصور والمستندات وعزل الصوتيات باحترافية.</p>
</a>
<!-- Tool 14: تلوين -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الصور" data-name="تلوين استخراج وتوليد لوحات الألوان المتناسقة palette color generator" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">palette</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">تلوين</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">استخراج وتوليد لوحات الألوان المتناسقة وتصدير أكواد الرموز بسهولة.</p>
</a>
<!-- Tool 15: مزامنة -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="التاريخ والوقت" data-name="مزامنة مقارنة ومزامنة التواقيت والتقاويم العالمية timezone calendar sync" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-charcoal text-white group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">schedule</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">مزامنة</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">مقارنة ومزامنة فروق التوقيت وتوافق التقاويم العالمية الهجرية والميلادية.</p>
</a>
<!-- Tool 16: حساب -->
<a class="tool-card group relative flex flex-col text-right p-6 rounded-2xl border border-nordic-border bg-nordic-card hover:border-nordic-dim/50 hover:shadow-bento-hover transition-all duration-200 min-h-[178px] shadow-bento" data-category="الحسابات" data-name="حساب حاسبة التمويل والفوائد والمعادلات التراكمية financial loan calculator" href="#">
  <div class="mb-4">
    <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-nordic-bg text-nordic-charcoal border border-nordic-border group-hover:scale-105 transition-transform duration-200">
      <span class="material-symbols-outlined text-[24px]">calculate</span>
    </div>
  </div>
  <h3 class="text-nordic-charcoal font-bold text-base mb-1.5 group-hover:text-nordic-accent transition-colors">حساب</h3>
  <p class="text-nordic-muted text-xs leading-relaxed line-clamp-2">حساب خطط التمويل والأقساط الشهرية وحسابات التضخم والنسب التراكمية.</p>
</a></div>
<!-- 4. Empty State Component (Hidden by default) -->
<div class="hidden flex-col items-center justify-center text-center py-16 px-4" id="emptyState">
<div class="w-12 h-12 flex items-center justify-center rounded-2xl bg-nordic-card text-nordic-dim border border-nordic-border mb-4 shadow-xs">
<span class="material-symbols-outlined text-2xl">search_off</span>
</div>
<h3 class="text-base font-semibold text-nordic-charcoal mb-1">لم نتمكن من العثور على أي أداة مطابقة</h3>
<p class="text-xs sm:text-sm text-nordic-muted max-w-sm mb-5 leading-normal">
                جرّب البحث بكلمات أخرى أو تصفح كافة التصنيفات المتاحة.
              </p>
<button class="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-nordic-card hover:bg-white text-nordic-charcoal border border-nordic-border shadow-xs transition-colors" id="resetFilterBtn" type="button">
                إعادة ضبط البحث والتصنيفات
              </button>
</div>
</main>
<!-- Minimal Understated Nordic Footer -->
<footer class="mt-auto border-t border-nordic-border/70 py-7 px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-nordic-dim gap-3">
<p class="">© 2025 منصة آحاد — أدوات رقمية سريعة وخفيفة</p>
<div class="flex items-center gap-6">
<a class="hover:text-nordic-charcoal transition-colors" href="#">سياسة الخصوصية</a>
<a class="hover:text-nordic-charcoal transition-colors" href="#">الشروط والأحكام</a>
<a class="hover:text-nordic-charcoal transition-colors" href="#">اقتراح أداة جديدة</a>
</div>
</footer>
</div>
</div>
</div>
</div>


</body></html>