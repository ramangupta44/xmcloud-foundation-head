using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json.Linq;
using Sitecore.Data.Items;
using Sitecore.Diagnostics;
using Sitecore.LayoutService.Configuration;
using Sitecore.LayoutService.ItemRendering.ContentsResolvers;
using Sitecore.Mvc.Presentation;

namespace XmCloudSXAStarter.CustomResolvers
{
    public class ParentItemResolver : RenderingContentsResolver
    {
        public override object ResolveContents(Rendering rendering, IRenderingConfiguration renderingConfig)
        {
            Assert.ArgumentNotNull(rendering, nameof(rendering));
            Assert.ArgumentNotNull(renderingConfig, nameof(renderingConfig));

            // Get the context item, which might be the page item if datasource is not set
            Item contextItem = rendering.Item ?? Sitecore.Context.Item;

            // Check for the parent item of the context item
            Item parentItem = contextItem?.Parent;

            // If the parent item is null, then just return the context item's details
            if (parentItem == null)
            {
                return contextItem != null ? ProcessItem(contextItem, rendering, renderingConfig) : null;
            }

            // Process the parent item instead of the context item
            JObject jobject = ProcessItem(parentItem, rendering, renderingConfig);

            // Optionally include the context item's details as well, if needed
            // jobject["contextItem"] = ProcessItem(contextItem, rendering, renderingConfig);

            return jobject;
        }


        // Add other necessary methods like ProcessItem and GetItems if they are not already implemented
    }
}