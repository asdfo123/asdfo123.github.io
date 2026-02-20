---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
---

{% assign cv_pdf_url = "https://cdn.jsdelivr.net/gh/asdfo123/asdfo123@main/CV_Xinye_Li.pdf" %}

<section style="border: 1px solid #ddd; border-radius: 10px; overflow: hidden;">
  <object data="{{ cv_pdf_url }}#view=FitH" type="application/pdf" style="width: 100%; height: calc(100vh - 2rem); min-height: 92vh;">
    <iframe src="{{ cv_pdf_url }}#view=FitH" style="width: 100%; height: calc(100vh - 2rem); min-height: 92vh; border: 0;" title="CV Preview"></iframe>
    <p style="padding: 1rem;">
      Preview is not available in your browser.
      <a href="{{ cv_pdf_url }}" target="_blank" rel="noopener">Open the PDF directly</a>.
    </p>
  </object>
</section>
