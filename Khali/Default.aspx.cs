using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Net;

namespace Khali
{
	public partial class Default : System.Web.UI.Page
	{
		// Functions
		protected string sbEncdWebUrl (string webRes)
		{
			if (!webRes.Contains("://")) webRes = "http://" + webRes;
			string Lnk = Server.UrlEncode(webRes);
			Lnk = "/Default.aspx?wr=" + Lnk;
			return Lnk;
		}

		// Event Handlers
		protected void Page_Load (object sender, EventArgs e)
		{
		}
		protected void Go_Click(object sender, EventArgs e)
		{
			Response.RedirectPermanent(sbEncdWebUrl(Url.Text));
		}
	}
}